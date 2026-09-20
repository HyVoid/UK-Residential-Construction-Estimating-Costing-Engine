/**
 * UK Residential Costing Engine — Type Definitions
 * Supporting the 8 Excel Workbook Sheets and Global State
 */

export type WorkSectionCode =
  | 'DEM' // Demolition & Strip Out
  | 'GW'  // Groundworks & Foundations
  | 'MAS' // Superstructure Masonry
  | 'STL' // Structural Steelwork
  | 'CAR' // Carpentry & Roof Framing
  | 'ROO' // Roofing & Cladding
  | 'FEN' // Windows & External Doors
  | 'PLA' // Drylining & Plastering
  | 'ELE' // Electrical Installation
  | 'PLU' // Plumbing & Heating
  | 'FIN' // Internal Finishes & Floor Laying
  | 'EXT';// External Works & Paving

export type CostCategory =
  | 'Labour & Material'
  | 'Labour Only'
  | 'Material Only'
  | 'Subcontract'
  | 'Labour & Plant'
  | 'Plant Only';

export type PrelimsMode = '% of Direct Cost' | 'Fixed Adjustments';

export type AdjustmentCategory = 'Preliminaries' | 'Provisional Sums' | 'Site Allowance';

export type CostBasisType = 'Fixed Lump Sum' | 'Weekly Rate' | 'Unit Rate';

export interface ProjectSetup {
  // Global Currency & Control
  currencySymbol: string; // Default: '£'
  selectedContractor: string; // e.g. 'Apex Builders Ltd'
  defaultWasteRate: number; // e.g. 0.05 (5.0%)
  prelimsMode: PrelimsMode; // '% of Direct Cost' or 'Fixed Adjustments'
  prelimsPct: number; // e.g. 0.08 (8.0%)
  ohpPct: number; // Overhead & Profit e.g. 0.15 (15.0%)
  contingencyPct: number; // e.g. 0.075 (7.5%)
  vatRate: number; // e.g. 0.20 (20.0%)
  toleranceThreshold: number; // e.g. 0.01

  // Project Metadata
  projectName: string;
  clientName: string;
  projectType: string;
  location: string;
  estimateDate: string;
  estimatorName: string;
  projectVersion: string;
  grossFloorAreaSqm: number; // e.g. 145 m²
}

export interface MasterItem {
  id: string; // unique internal id
  masterItemCode: string; // e.g. 'GW-001'
  workSection: string; // e.g. 'Groundworks & Foundations'
  standardDescription: string;
  standardUnit: string; // 'm²', 'm³', 'm', 'nr', 't', 'item'
  costCategory: CostCategory;
  defaultWastePct: number; // 0.0 to 0.20
  activeStatus: 'Active' | 'Archived';
}

export interface ContractorRate {
  id: string;
  contractorName: string;
  rateItemCode: string;
  baseLabourRate: number;
  baseMaterialRate: number;
  baseSubcontractRate: number;
  plantRate: number;
  rateEffectiveDate: string;
  rateNotes?: string;
}

export interface TakeoffRow {
  id: string;
  takeoffItemCode: string; // reference to MasterItem
  measuredQuantity: number;
  locationRef: string; // e.g. 'Ground Floor Rear Extension'
  wasteOverridePct?: number | null; // optional override
  rateOverrideValue?: number | null; // manual rate override escape hatch
  overrideReason?: string;
}

export interface AdjustmentItem {
  id: string;
  adjustmentCategory: AdjustmentCategory;
  adjustmentDescription: string;
  costBasisType: CostBasisType;
  inputQuantityDuration: number; // duration (weeks) or quantity
  inputUnitRate: number; // rate per unit / week or fixed lump sum
  notes?: string;
}

export interface WorkbookState {
  version: string;
  lastSaved: string; // ISO string
  setup: ProjectSetup;
  itemMaster: MasterItem[];
  rateLibrary: ContractorRate[];
  projectEstimate: TakeoffRow[];
  adjustments: AdjustmentItem[];
}

export type ActiveTab =
  | '01_Setup'
  | '02_Item_Master'
  | '03_Rate_Library'
  | '04_Project_Estimate'
  | '05_Adjustments'
  | '06_Internal_Estimate'
  | '07_Customer_Estimate'
  | '08_Checks';

export interface CalculatedTakeoffItem {
  id: string;
  takeoffItemCode: string;
  measuredQuantity: number;
  locationRef: string;
  workSection: string;
  standardDescription: string;
  standardUnit: string;
  wasteOverridePct?: number | null;
  effectiveWasteRate: number;
  netCalculatedQuantity: number;

  matchedLabourRate: number;
  matchedMaterialRate: number;
  matchedSubcontractRate: number;
  matchedPlantRate: number;
  rateOverrideValue?: number | null;
  overrideReason?: string;
  totalUnitRate: number;

  lineLabourCost: number;
  lineMaterialCost: number;
  lineSubcontractCost: number;
  linePlantCost: number;
  lineDirectCostTotal: number;

  hasError: boolean;
  errorMessage?: string;
}

export interface SectionCostSummary {
  sectionName: string;
  directLabour: number;
  directMaterial: number;
  directSubcontract: number;
  directPlant: number;
  directTotal: number;
  percentageOfDirect: number;
}

export interface InternalEstimateTotals {
  sectionSummaries: SectionCostSummary[];
  totalDirectCost: number;
  totalLabour: number;
  totalMaterial: number;
  totalSubcontract: number;
  totalPlant: number;

  prelimsAmount: number;
  primeCostSubtotal: number;
  overheadProfitAmount: number;
  contingencyAmount: number;
  provisionalSumsTotal: number;
  grossContractSumInternal: number;

  // KPIs
  breakevenCost: number;
  targetGrossMarginPct: number;
  costPerSqm: number;
  materialToLabourRatio: number;
}

export interface CustomerEstimateItem {
  id: string;
  sectionName: string;
  itemDescription: string;
  unit: string;
  quantity: number;
  customerUnitRateBlended: number;
  customerLineTotal: number;
}

export interface CustomerEstimateSectionGroup {
  sectionName: string;
  items: CustomerEstimateItem[];
  sectionSubtotal: number;
}

export interface CustomerEstimateTotals {
  sections: CustomerEstimateSectionGroup[];
  worksNetTotal: number;
  provisionalSumsTotal: number;
  totalNetEstimate: number;
  vatAmount: number;
  totalGrossQuotation: number;
}

export interface ChecksAuditResult {
  unmappedCodesCount: number;
  unmappedCodeItems: string[];
  missingRatesCount: number;
  missingRateItems: string[];
  duplicateMasterCodesCount: number;
  duplicateMasterCodes: string[];
  overrideCount: number;
  overriddenItems: { code: string; override: number; reason: string }[];
  grossMarginPct: number;
  grossMarginAlert: boolean;
  grossMarginMessage: string;
  balanceDifference: number;
  balanceIntegrityStatus: 'PASS' | 'FAIL';
  balanceMessage: string;
}
