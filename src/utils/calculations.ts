/**
 * UK Residential Costing Engine — Real-time Calculation Pipeline
 * Replicates Excel 365 Dynamic Array and cross-sheet business logic in pure JavaScript.
 */

import {
  WorkbookState,
  CalculatedTakeoffItem,
  InternalEstimateTotals,
  SectionCostSummary,
  CustomerEstimateTotals,
  CustomerEstimateSectionGroup,
  CustomerEstimateItem,
  ChecksAuditResult,
} from '../types';

/**
 * Calculates row-by-row direct costs for Project Estimate (Sheet 04).
 */
export function calculateTakeoffRows(state: WorkbookState): CalculatedTakeoffItem[] {
  const { setup, itemMaster, rateLibrary, projectEstimate } = state;
  const masterMap = new Map(itemMaster.map((item) => [item.masterItemCode.trim().toUpperCase(), item]));

  // Build rate lookup map: "CONTRACTOR|CODE" -> ContractorRate
  const rateMap = new Map(
    rateLibrary.map((rate) => [
      `${rate.contractorName.trim().toLowerCase()}|${rate.rateItemCode.trim().toUpperCase()}`,
      rate,
    ])
  );

  return projectEstimate.map((row) => {
    const code = (row.takeoffItemCode || '').trim().toUpperCase();
    const master = masterMap.get(code);

    let hasError = false;
    let errorMessage = '';

    if (!code) {
      hasError = true;
      errorMessage = 'Empty item code';
    } else if (!master) {
      hasError = true;
      errorMessage = '⚠️ Unregistered Master Code';
    }

    const workSection = master ? master.workSection : 'Unassigned';
    const standardDescription = master ? master.standardDescription : 'Unknown Specification';
    const standardUnit = master ? master.standardUnit : 'nr';

    // Effective Waste Rate Hierarchy:
    // 1. Manual Waste Override
    // 2. Master Item default waste
    // 3. Global default waste from Setup
    let effectiveWasteRate = setup.defaultWasteRate;
    if (row.wasteOverridePct !== null && row.wasteOverridePct !== undefined && !isNaN(row.wasteOverridePct)) {
      effectiveWasteRate = Number(row.wasteOverridePct);
    } else if (master && master.defaultWastePct !== undefined && master.defaultWastePct !== null) {
      effectiveWasteRate = Number(master.defaultWastePct);
    }

    const measuredQty = Number(row.measuredQuantity) || 0;
    const netCalculatedQuantity = measuredQty * (1 + effectiveWasteRate);

    // Look up Contractor Rates
    const lookupKey = `${setup.selectedContractor.trim().toLowerCase()}|${code}`;
    const matchedRate = rateMap.get(lookupKey);

    const matchedLabourRate = matchedRate ? Number(matchedRate.baseLabourRate) || 0 : 0;
    const matchedMaterialRate = matchedRate ? Number(matchedRate.baseMaterialRate) || 0 : 0;
    const matchedSubcontractRate = matchedRate ? Number(matchedRate.baseSubcontractRate) || 0 : 0;
    const matchedPlantRate = matchedRate ? Number(matchedRate.plantRate) || 0 : 0;

    const naturalUnitRate =
      matchedLabourRate + matchedMaterialRate + matchedSubcontractRate + matchedPlantRate;

    // Total Unit Rate: Manual Override or Sum of 4 Components
    let totalUnitRate = naturalUnitRate;
    const isOverridden =
      row.rateOverrideValue !== null &&
      row.rateOverrideValue !== undefined &&
      !isNaN(row.rateOverrideValue);

    if (isOverridden) {
      totalUnitRate = Number(row.rateOverrideValue);
    }

    if (code && !hasError && naturalUnitRate === 0 && !isOverridden) {
      hasError = true;
      errorMessage = '⚠️ Missing Contractor Rate';
    }

    // Direct Cost Components
    const lineLabourCost = netCalculatedQuantity * matchedLabourRate;
    const lineMaterialCost = netCalculatedQuantity * matchedMaterialRate;
    const lineSubcontractCost = netCalculatedQuantity * matchedSubcontractRate;
    const linePlantCost = netCalculatedQuantity * matchedPlantRate;
    const lineDirectCostTotal = netCalculatedQuantity * totalUnitRate;

    return {
      id: row.id,
      takeoffItemCode: row.takeoffItemCode,
      measuredQuantity: measuredQty,
      locationRef: row.locationRef,
      workSection,
      standardDescription,
      standardUnit,
      wasteOverridePct: row.wasteOverridePct,
      effectiveWasteRate,
      netCalculatedQuantity,

      matchedLabourRate,
      matchedMaterialRate,
      matchedSubcontractRate,
      matchedPlantRate,
      rateOverrideValue: row.rateOverrideValue,
      overrideReason: row.overrideReason,
      totalUnitRate,

      lineLabourCost,
      lineMaterialCost,
      lineSubcontractCost,
      linePlantCost,
      lineDirectCostTotal,

      hasError,
      errorMessage,
    };
  });
}

/**
 * Calculates internal cost build-up, section breakdowns, and commercial KPIs (Sheet 06).
 */
export function calculateInternalEstimate(
  state: WorkbookState,
  calculatedTakeoff: CalculatedTakeoffItem[]
): InternalEstimateTotals {
  const { setup, adjustments } = state;

  // Aggregate by Work Section
  const sectionMap = new Map<
    string,
    { labour: number; material: number; subcontract: number; plant: number; total: number }
  >();

  let totalDirectCost = 0;
  let totalLabour = 0;
  let totalMaterial = 0;
  let totalSubcontract = 0;
  let totalPlant = 0;

  for (const item of calculatedTakeoff) {
    totalDirectCost += item.lineDirectCostTotal;
    totalLabour += item.lineLabourCost;
    totalMaterial += item.lineMaterialCost;
    totalSubcontract += item.lineSubcontractCost;
    totalPlant += item.linePlantCost;

    const current = sectionMap.get(item.workSection) || {
      labour: 0,
      material: 0,
      subcontract: 0,
      plant: 0,
      total: 0,
    };

    current.labour += item.lineLabourCost;
    current.material += item.lineMaterialCost;
    current.subcontract += item.lineSubcontractCost;
    current.plant += item.linePlantCost;
    current.total += item.lineDirectCostTotal;

    sectionMap.set(item.workSection, current);
  }

  const sectionSummaries: SectionCostSummary[] = Array.from(sectionMap.entries()).map(
    ([sectionName, sums]) => ({
      sectionName,
      directLabour: sums.labour,
      directMaterial: sums.material,
      directSubcontract: sums.subcontract,
      directPlant: sums.plant,
      directTotal: sums.total,
      percentageOfDirect: totalDirectCost > 0 ? (sums.total / totalDirectCost) * 100 : 0,
    })
  );

  // Sort sections by total direct cost descending
  sectionSummaries.sort((a, b) => b.directTotal - a.directTotal);

  // Preliminaries calculation
  let prelimsAmount = 0;
  const prelimsAdjustmentsSum = adjustments
    .filter((a) => a.adjustmentCategory === 'Preliminaries')
    .reduce((acc, a) => acc + (Number(a.inputQuantityDuration) || 0) * (Number(a.inputUnitRate) || 0), 0);

  if (setup.prelimsMode === '% of Direct Cost') {
    prelimsAmount = totalDirectCost * setup.prelimsPct;
  } else {
    prelimsAmount = prelimsAdjustmentsSum;
  }

  // Prime Cost
  const primeCostSubtotal = totalDirectCost + prelimsAmount;

  // Overhead & Profit (OHP) and Contingency applied to Prime Cost
  const overheadProfitAmount = primeCostSubtotal * setup.ohpPct;
  const contingencyAmount = primeCostSubtotal * setup.contingencyPct;

  // Provisional Sums
  const provisionalSumsTotal = adjustments
    .filter((a) => a.adjustmentCategory === 'Provisional Sums')
    .reduce((acc, a) => acc + (Number(a.inputQuantityDuration) || 0) * (Number(a.inputUnitRate) || 0), 0);

  // Internal Gross Contract Sum
  const grossContractSumInternal =
    primeCostSubtotal + overheadProfitAmount + contingencyAmount + provisionalSumsTotal;

  // Commercial Decision KPIs
  const breakevenCost = totalDirectCost + prelimsAmount;
  const targetGrossMarginPct =
    grossContractSumInternal > 0
      ? (grossContractSumInternal - breakevenCost) / grossContractSumInternal
      : 0;

  const costPerSqm =
    setup.grossFloorAreaSqm > 0 ? totalDirectCost / setup.grossFloorAreaSqm : 0;

  const materialToLabourRatio = totalLabour > 0 ? totalMaterial / totalLabour : 0;

  return {
    sectionSummaries,
    totalDirectCost,
    totalLabour,
    totalMaterial,
    totalSubcontract,
    totalPlant,
    prelimsAmount,
    primeCostSubtotal,
    overheadProfitAmount,
    contingencyAmount,
    provisionalSumsTotal,
    grossContractSumInternal,
    breakevenCost,
    targetGrossMarginPct,
    costPerSqm,
    materialToLabourRatio,
  };
}

/**
 * Calculates customer-facing quotation with desensitized blended rates (Sheet 07).
 */
export function calculateCustomerEstimate(
  state: WorkbookState,
  calculatedTakeoff: CalculatedTakeoffItem[],
  internalTotals: InternalEstimateTotals
): CustomerEstimateTotals {
  const { setup } = state;
  const { totalDirectCost, grossContractSumInternal, provisionalSumsTotal } = internalTotals;

  // Markup factor to amortize Prelims, OHP, and Contingency into each direct item rate:
  // Markup Factor = (Internal Gross - Provisional Sums) / Total Direct Cost
  const markupFactor =
    totalDirectCost > 0 ? (grossContractSumInternal - provisionalSumsTotal) / totalDirectCost : 1;

  // Group items by Work Section
  const grouped = new Map<string, CustomerEstimateItem[]>();

  for (const item of calculatedTakeoff) {
    if (!item.takeoffItemCode) continue;

    const blendedRate = item.totalUnitRate * markupFactor;
    const clientQty = item.netCalculatedQuantity;
    const lineTotal = clientQty * blendedRate;

    const custItem: CustomerEstimateItem = {
      id: item.id,
      sectionName: item.workSection,
      itemDescription: item.standardDescription,
      unit: item.standardUnit,
      quantity: clientQty,
      customerUnitRateBlended: blendedRate,
      customerLineTotal: lineTotal,
    };

    const list = grouped.get(item.workSection) || [];
    list.push(custItem);
    grouped.set(item.workSection, list);
  }

  let worksNetTotal = 0;
  const sections: CustomerEstimateSectionGroup[] = Array.from(grouped.entries()).map(
    ([sectionName, items]) => {
      const sectionSubtotal = items.reduce((acc, it) => acc + it.customerLineTotal, 0);
      worksNetTotal += sectionSubtotal;
      return {
        sectionName,
        items,
        sectionSubtotal,
      };
    }
  );

  const totalNetEstimate = worksNetTotal + provisionalSumsTotal;
  const vatAmount = totalNetEstimate * setup.vatRate;
  const totalGrossQuotation = totalNetEstimate + vatAmount;

  return {
    sections,
    worksNetTotal,
    provisionalSumsTotal,
    totalNetEstimate,
    vatAmount,
    totalGrossQuotation,
  };
}

/**
 * Runs 6-point integrity and commercial risk audit (Sheet 08).
 */
export function calculateAuditChecks(
  state: WorkbookState,
  calculatedTakeoff: CalculatedTakeoffItem[],
  internalTotals: InternalEstimateTotals,
  customerTotals: CustomerEstimateTotals
): ChecksAuditResult {
  const { setup, itemMaster } = state;

  // 1. Unmapped item codes
  const masterCodesSet = new Set(itemMaster.map((im) => im.masterItemCode.trim().toUpperCase()));
  const unmappedCodeItems: string[] = [];
  for (const row of state.projectEstimate) {
    const code = (row.takeoffItemCode || '').trim().toUpperCase();
    if (code && !masterCodesSet.has(code)) {
      unmappedCodeItems.push(`${code} (${row.locationRef || 'No location'})`);
    }
  }

  // 2. Missing rates
  const missingRateItems: string[] = [];
  for (const item of calculatedTakeoff) {
    if (item.takeoffItemCode && item.measuredQuantity > 0 && item.totalUnitRate === 0) {
      missingRateItems.push(`${item.takeoffItemCode} - ${item.standardDescription}`);
    }
  }

  // 3. Duplicate Master Codes
  const codeOccurrences = new Map<string, number>();
  for (const im of itemMaster) {
    const c = im.masterItemCode.trim().toUpperCase();
    codeOccurrences.set(c, (codeOccurrences.get(c) || 0) + 1);
  }
  const duplicateMasterCodes = Array.from(codeOccurrences.entries())
    .filter(([_, count]) => count > 1)
    .map(([c, count]) => `${c} (${count} entries)`);

  // 4. Overridden Items Count
  const overriddenItems: { code: string; override: number; reason: string }[] = [];
  for (const row of state.projectEstimate) {
    if (
      row.rateOverrideValue !== null &&
      row.rateOverrideValue !== undefined &&
      !isNaN(row.rateOverrideValue)
    ) {
      overriddenItems.push({
        code: row.takeoffItemCode,
        override: Number(row.rateOverrideValue),
        reason: row.overrideReason || 'No reason provided',
      });
    }
  }

  // 5. Commercial Gross Margin Alert (< 10% red line)
  const grossMarginPct = internalTotals.targetGrossMarginPct;
  const grossMarginAlert = grossMarginPct < 0.10;
  const grossMarginMessage = grossMarginAlert
    ? `🚨 CRITICAL: Gross margin (${(grossMarginPct * 100).toFixed(1)}%) is below the 10.0% safety threshold!`
    : `✅ PASS: Gross margin (${(grossMarginPct * 100).toFixed(1)}%) satisfies commercial target.`;

  // 6. Balance Integrity Status (Customer Net vs Internal Gross)
  const balanceDifference = Math.abs(customerTotals.totalNetEstimate - internalTotals.grossContractSumInternal);
  const isBalanced = balanceDifference <= setup.toleranceThreshold;
  const balanceIntegrityStatus: 'PASS' | 'FAIL' = isBalanced ? 'PASS' : 'FAIL';
  const balanceMessage = isBalanced
    ? `✅ PASS: Customer Quotation Net (${setup.currencySymbol}${customerTotals.totalNetEstimate.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) perfectly matches Internal Gross Contract Sum within ±${setup.currencySymbol}${setup.toleranceThreshold}.`
    : `❌ FAIL: Discrepancy of ${setup.currencySymbol}${balanceDifference.toFixed(2)} detected between Customer Net and Internal Gross!`;

  return {
    unmappedCodesCount: unmappedCodeItems.length,
    unmappedCodeItems,
    missingRatesCount: missingRateItems.length,
    missingRateItems,
    duplicateMasterCodesCount: duplicateMasterCodes.length,
    duplicateMasterCodes,
    overrideCount: overriddenItems.length,
    overriddenItems,
    grossMarginPct,
    grossMarginAlert,
    grossMarginMessage,
    balanceDifference,
    balanceIntegrityStatus,
    balanceMessage,
  };
}

/**
 * Format currency helper
 */
export function formatCurrency(val: number, symbol: string = '£'): string {
  if (isNaN(val) || val === null || val === undefined) return `${symbol}0.00`;
  return `${symbol}${val.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format percentage helper
 */
export function formatPercent(val: number, decimals: number = 1): string {
  if (isNaN(val) || val === null || val === undefined) return '0.0%';
  return `${(val * 100).toFixed(decimals)}%`;
}
