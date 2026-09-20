import React from 'react';
import {
  InternalEstimateTotals,
  ProjectSetup,
} from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';
import {
  TrendingUp,
  PieChart,
  ShieldAlert,
  Calculator,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface InternalEstimateViewProps {
  totals: InternalEstimateTotals;
  setup: ProjectSetup;
}

export const InternalEstimateView: React.FC<InternalEstimateViewProps> = ({ totals, setup }) => {
  const {
    sectionSummaries,
    totalDirectCost,
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
  } = totals;

  const maxSectionTotal = Math.max(...sectionSummaries.map((s) => s.directTotal), 1000);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
              06_Internal_Estimate: Commercial Cost Build-up & KPIs
            </h1>
            <span className="pill-badge bg-[#D32F2F]/10 text-[#D32F2F] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Confidential — Contractor Internal Only
            </span>
          </div>
          <p className="text-[13px] text-[#888888]">
            Exposes full direct cost architecture (Labour/Material/Subcontract/Plant), layered Preliminaries, OHP markups, and project breakeven sensitivity.
          </p>
        </div>
      </div>

      {/* Hero KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Contract Sum */}
        <div className="cost-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1 flex items-center justify-between">
            <span>Gross Contract Sum</span>
            <span className="text-[#2251FF] font-bold">Total Tender</span>
          </div>
          <div className="font-display text-[26px] sm:text-[32px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(grossContractSumInternal, setup.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#888888] mt-2">
            Internal benchmark for client quotation
          </div>
        </div>

        {/* Breakeven Floor */}
        <div className="cost-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1 flex items-center justify-between">
            <span>Breakeven Cost Floor</span>
            <span className="text-[#888888]">Direct + Prelims</span>
          </div>
          <div className="font-display text-[24px] sm:text-[28px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(breakevenCost, setup.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#888888] mt-2">
            Zero profit threshold — baseline viability line
          </div>
        </div>

        {/* Target Gross Margin % */}
        <div className="cost-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1 flex items-center justify-between">
            <span>Target Gross Margin %</span>
            <span className="text-[#2251FF] font-bold font-mono">
              {formatPercent(targetGrossMarginPct, 1)}
            </span>
          </div>
          <div className="font-display text-[24px] sm:text-[28px] font-bold text-[#051C2C] leading-none">
            {formatPercent(targetGrossMarginPct, 1)}
          </div>
          <div className="text-[11px] text-[#888888] mt-2">
            Net markup above direct & site costs
          </div>
        </div>

        {/* Cost per SQM */}
        <div className="cost-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1 flex items-center justify-between">
            <span>Direct Cost / m² (GFA)</span>
            <span className="text-[#888888]">{setup.grossFloorAreaSqm} m² GFA</span>
          </div>
          <div className="font-display text-[24px] sm:text-[28px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(costPerSqm, setup.currencySymbol)}
            <span className="text-[14px] font-normal text-[#888888]">/m²</span>
          </div>
          <div className="text-[11px] text-[#888888] mt-2">
            Mat-to-Labour ratio: <strong>{materialToLabourRatio.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Main Split: Left = Waterfall Build-up, Right = Section Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waterfall Cost Build-up (5 Cols) */}
        <div className="lg:col-span-5 cost-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E8E6]">
            <Calculator className="w-4 h-4 text-[#2251FF]" />
            <h2 className="font-heading text-[18px] font-bold text-[#051C2C]">
              Commercial Cost Build-up Waterfall
            </h2>
          </div>

          <div className="space-y-3 text-[13px]">
            {/* Direct Cost */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#E8E8E6]/60">
              <span className="text-[#051C2C] font-medium">1. Total Direct Cost (Direct Works Total)</span>
              <span className="font-mono font-bold text-[#051C2C]">
                {formatCurrency(totalDirectCost, setup.currencySymbol)}
              </span>
            </div>

            {/* Preliminaries */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#E8E8E6]/60">
              <div>
                <span className="text-[#051C2C] font-medium">2. Site Preliminaries</span>
                <span className="text-[11px] text-[#888888] ml-2">
                  ({setup.prelimsMode === '% of Direct Cost' ? `${formatPercent(setup.prelimsPct)} of Direct` : 'Itemized Sheet 05'})
                </span>
              </div>
              <span className="font-mono font-bold text-[#051C2C]">
                {formatCurrency(prelimsAmount, setup.currencySymbol)}
              </span>
            </div>

            {/* Prime Cost Subtotal */}
            <div className="flex items-center justify-between py-2 px-3 bg-[#F5F5F2] rounded-[6px] font-semibold text-[#051C2C]">
              <span>Prime Cost Subtotal (1 + 2)</span>
              <span className="font-mono text-[14px]">
                {formatCurrency(primeCostSubtotal, setup.currencySymbol)}
              </span>
            </div>

            {/* Overhead & Profit */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#E8E8E6]/60">
              <div>
                <span className="text-[#051C2C] font-medium">3. Overhead & Profit (OHP)</span>
                <span className="text-[11px] text-[#2251FF] ml-2 font-semibold">
                  {formatPercent(setup.ohpPct)}
                </span>
              </div>
              <span className="font-mono font-bold text-[#051C2C]">
                {formatCurrency(overheadProfitAmount, setup.currencySymbol)}
              </span>
            </div>

            {/* Contingency */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#E8E8E6]/60">
              <div>
                <span className="text-[#051C2C] font-medium">4. Risk Contingency Reserve</span>
                <span className="text-[11px] text-[#888888] ml-2">
                  {formatPercent(setup.contingencyPct)}
                </span>
              </div>
              <span className="font-mono font-bold text-[#051C2C]">
                {formatCurrency(contingencyAmount, setup.currencySymbol)}
              </span>
            </div>

            {/* Provisional Sums */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#E8E8E6]/60">
              <div>
                <span className="text-[#051C2C] font-medium">5. Defined Provisional Sums</span>
                <span className="text-[11px] text-[#888888] ml-2">(Kitchen, Bathrooms, Ground)</span>
              </div>
              <span className="font-mono font-bold text-[#051C2C]">
                {formatCurrency(provisionalSumsTotal, setup.currencySymbol)}
              </span>
            </div>

            {/* Internal Gross Contract Sum */}
            <div className="flex items-center justify-between p-3.5 bg-[#051C2C] text-white rounded-[8px] font-bold mt-4 shadow-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#2251FF]">
                  Gross Contract Sum (Internal)
                </div>
                <div className="text-[11px] font-normal text-white/70">
                  Target Commercial Baseline
                </div>
              </div>
              <div className="font-display text-[22px] sm:text-[26px]">
                {formatCurrency(grossContractSumInternal, setup.currencySymbol)}
              </div>
            </div>
          </div>
        </div>

        {/* Section Cost Breakdown Matrix (7 Cols) */}
        <div className="lg:col-span-7 cost-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#2251FF]" />
              <h2 className="font-heading text-[18px] font-bold text-[#051C2C]">
                Direct Cost Distribution by Work Section
              </h2>
            </div>
            <span className="text-[12px] text-[#888888]">
              {sectionSummaries.length} active trade sections
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="table-header-cell px-3 py-2.5">Work Section</th>
                  <th className="table-header-cell px-2 py-2.5 text-right">Labour</th>
                  <th className="table-header-cell px-2 py-2.5 text-right">Material</th>
                  <th className="table-header-cell px-2 py-2.5 text-right">Subcontract</th>
                  <th className="table-header-cell px-3 py-2.5 text-right">Direct Total</th>
                  <th className="table-header-cell px-3 py-2.5 w-24 text-right">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E6]">
                {sectionSummaries.map((sec, idx) => {
                  const barWidth = Math.min(100, Math.max(3, (sec.directTotal / maxSectionTotal) * 100));

                  return (
                    <tr
                      key={sec.sectionName}
                      className={`hover:bg-[#051C2C]/[0.02] transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F2]/40'
                      }`}
                    >
                      <td className="px-3 py-2 font-medium text-[#051C2C] max-w-[180px] truncate" title={sec.sectionName}>
                        {sec.sectionName}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-[#051C2C]">
                        {formatCurrency(sec.directLabour, setup.currencySymbol)}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-[#051C2C]">
                        {formatCurrency(sec.directMaterial, setup.currencySymbol)}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-[#051C2C]">
                        {formatCurrency(sec.directSubcontract, setup.currencySymbol)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-[#051C2C]">
                        {formatCurrency(sec.directTotal, setup.currencySymbol)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono">
                        <span className="font-semibold text-[#051C2C]">
                          {sec.percentageOfDirect.toFixed(1)}%
                        </span>
                        <div className="w-full h-1 bg-[#051C2C]/10 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${barWidth}%`,
                              backgroundColor: 'var(--color-accent)',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {sectionSummaries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#888888]">
                      No section data available. Enter items in 04_Project_Estimate.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Strategic Insight Block */}
      <div className="insight-block p-5">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-[#2251FF] shrink-0 mt-0.5" />
          <div className="space-y-1 text-[13px] text-[#051C2C]">
            <h3 className="font-bold">Commercial Feasibility & Risk Recommendation:</h3>
            <p>
              • <strong>Margin Discipline:</strong> The current pricing structure yields a target commercial gross margin
              of <strong>{formatPercent(targetGrossMarginPct, 1)}</strong>. Any contractor negotiations lowering this below 10.0%
              will trigger a formal commercial warning on Sheet 08.
            </p>
            <p>
              • <strong>Risk Allocation:</strong> The combined contingency and preliminaries allowance of{' '}
              <strong>{formatCurrency(prelimsAmount + contingencyAmount, setup.currencySymbol)}</strong> adequately shelters
              unknown underground obstructions and structural temporary works.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
