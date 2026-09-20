import React from 'react';
import { ChecksAuditResult, ActiveTab } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  FileCode,
  DollarSign,
  Layers,
} from 'lucide-react';

interface ChecksViewProps {
  auditResult: ChecksAuditResult;
  currencySymbol: string;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const ChecksView: React.FC<ChecksViewProps> = ({
  auditResult,
  currencySymbol,
  onNavigateTab,
}) => {
  const {
    unmappedCodesCount,
    unmappedCodeItems,
    missingRatesCount,
    missingRateItems,
    duplicateMasterCodesCount,
    duplicateMasterCodes,
    overrideCount,
    overriddenItems,
    grossMarginPct,
    grossMarginAlert,
    grossMarginMessage,
    balanceDifference,
    balanceIntegrityStatus,
    balanceMessage,
  } = auditResult;

  const allPassed =
    unmappedCodesCount === 0 &&
    missingRatesCount === 0 &&
    duplicateMasterCodesCount === 0 &&
    !grossMarginAlert &&
    balanceIntegrityStatus === 'PASS';

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8E6]">
        <div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
            08_Checks: Governance & Risk Audit Dashboard
          </h1>
          <p className="text-[13px] text-[#888888]">
            Automated six-point verification engine. Intercepts unregistered item codes, missing contractor rates, commercial margin redlines, and reconciliation discrepancies.
          </p>
        </div>

        <div>
          {allPassed ? (
            <span className="pill-badge bg-[#00C853]/10 text-[#00C853] text-[13px] px-3 py-1 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              100% AUDIT PASSED
            </span>
          ) : (
            <span className="pill-badge bg-[#D32F2F]/10 text-[#D32F2F] text-[13px] px-3 py-1 font-bold">
              <AlertTriangle className="w-4 h-4" />
              ACTION REQUIRED
            </span>
          )}
        </div>
      </div>

      {/* Main Reconciliation Banner (Balance Integrity) */}
      <div
        className={`cost-card p-6 border-l-4 ${
          balanceIntegrityStatus === 'PASS'
            ? 'border-l-[#00C853] bg-white'
            : 'border-l-[#D32F2F] bg-[#D32F2F]/5'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#2251FF]" />
              Core Rule 6: Internal vs External Balance Integrity Status
            </div>
            <div className="font-heading text-[18px] sm:text-[20px] font-bold text-[#051C2C]">
              {balanceMessage}
            </div>
            <p className="text-[12px] text-[#888888]">
              Validates that the amortized customer quote sum matches the internal commercial cost build-up (Direct + Prelims + OHP + Contingency + Provisional Sums).
            </p>
          </div>

          <div className="text-right shrink-0">
            <span
              className={`pill-badge text-[14px] px-4 py-1.5 font-bold ${
                balanceIntegrityStatus === 'PASS'
                  ? 'bg-[#00C853]/10 text-[#00C853]'
                  : 'bg-[#D32F2F] text-white'
              }`}
            >
              {balanceIntegrityStatus}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Secondary Audit Rule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Rule 1: Unmapped Codes */}
        <div className="cost-card p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-[#2251FF]" />
                Rule 1: Unmapped Item Codes
              </span>
              <span
                className={`pill-badge ${
                  unmappedCodesCount === 0
                    ? 'bg-[#00C853]/10 text-[#00C853]'
                    : 'bg-[#D32F2F]/10 text-[#D32F2F]'
                }`}
              >
                {unmappedCodesCount === 0 ? '0 issues' : `${unmappedCodesCount} unregistered`}
              </span>
            </div>
            <div className="font-display text-[22px] font-bold text-[#051C2C]">
              {unmappedCodesCount === 0 ? 'All Codes Registered' : `${unmappedCodesCount} Unknown Codes`}
            </div>
            <p className="text-[12px] text-[#888888]">
              Checks if all takeoff rows reference a valid item in 02_Item_Master.
            </p>
            {unmappedCodeItems.length > 0 && (
              <div className="p-2.5 rounded bg-[var(--anomaly-bg)] text-[11px] text-[var(--color-negative)] font-mono space-y-1">
                {unmappedCodeItems.map((c, i) => (
                  <div key={i}>• {c}</div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('04_Project_Estimate')}
            className="text-[12px] text-[#2251FF] hover:underline font-semibold flex items-center gap-1 pt-2"
          >
            Review Project Estimate <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Rule 2: Missing Rates */}
        <div className="cost-card p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#2251FF]" />
                Rule 2: Contractor Rate Coverage
              </span>
              <span
                className={`pill-badge ${
                  missingRatesCount === 0
                    ? 'bg-[#00C853]/10 text-[#00C853]'
                    : 'bg-[#D32F2F]/10 text-[#D32F2F]'
                }`}
              >
                {missingRatesCount === 0 ? '0 missing' : `${missingRatesCount} unpriced`}
              </span>
            </div>
            <div className="font-display text-[22px] font-bold text-[#051C2C]">
              {missingRatesCount === 0 ? 'All Items Priced' : `${missingRatesCount} Zero-Priced Items`}
            </div>
            <p className="text-[12px] text-[#888888]">
              Flags items with positive measured quantity but £0.00 matched contractor unit rate.
            </p>
            {missingRateItems.length > 0 && (
              <div className="p-2.5 rounded bg-[var(--anomaly-bg)] text-[11px] text-[var(--color-negative)] font-mono space-y-1">
                {missingRateItems.map((r, i) => (
                  <div key={i}>• {r}</div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('03_Rate_Library')}
            className="text-[12px] text-[#2251FF] hover:underline font-semibold flex items-center gap-1 pt-2"
          >
            Update Rate Library <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Rule 3: Duplicate Master Codes */}
        <div className="cost-card p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#2251FF]" />
                Rule 3: Master Primary Key Uniqueness
              </span>
              <span
                className={`pill-badge ${
                  duplicateMasterCodesCount === 0
                    ? 'bg-[#00C853]/10 text-[#00C853]'
                    : 'bg-[#D32F2F]/10 text-[#D32F2F]'
                }`}
              >
                {duplicateMasterCodesCount === 0 ? 'Unique' : `${duplicateMasterCodesCount} duplicates`}
              </span>
            </div>
            <div className="font-display text-[22px] font-bold text-[#051C2C]">
              {duplicateMasterCodesCount === 0
                ? 'Master PKs Unique'
                : `${duplicateMasterCodesCount} Duplicate Keys`}
            </div>
            <p className="text-[12px] text-[#888888]">
              Prevents ambiguous lookup collisions in 02_Item_Master.
            </p>
            {duplicateMasterCodes.length > 0 && (
              <div className="p-2.5 rounded bg-[var(--anomaly-bg)] text-[11px] text-[var(--color-negative)] font-mono space-y-1">
                {duplicateMasterCodes.map((d, i) => (
                  <div key={i}>• {d}</div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('02_Item_Master')}
            className="text-[12px] text-[#2251FF] hover:underline font-semibold flex items-center gap-1 pt-2"
          >
            Clean Master Dictionary <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Rule 4: Manual Overrides Audit Trail */}
        <div className="cost-card p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                Rule 4: Manual Override Frequency
              </span>
              <span className="pill-badge bg-[#051C2C]/5 text-[#051C2C]">
                {overrideCount} recorded
              </span>
            </div>
            <div className="font-display text-[22px] font-bold text-[#051C2C]">
              {overrideCount === 0 ? 'Zero Manual Overrides' : `${overrideCount} Active Overrides`}
            </div>
            <p className="text-[12px] text-[#888888]">
              Tracks QS manual rate overrides bypassing standard rate matrices for governance.
            </p>
            {overriddenItems.length > 0 && (
              <div className="p-2.5 rounded bg-[#F5F5F2] text-[11px] text-[#051C2C] font-mono space-y-1">
                {overriddenItems.map((o, i) => (
                  <div key={i}>
                    • <strong>{o.code}:</strong> {currencySymbol}{o.override.toFixed(2)} ({o.reason})
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('04_Project_Estimate')}
            className="text-[12px] text-[#2251FF] hover:underline font-semibold flex items-center gap-1 pt-2"
          >
            Inspect Overrides in Sheet 04 <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Rule 5: Commercial Margin Redline */}
        <div className="cost-card p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                Rule 5: Commercial Margin Redline
              </span>
              <span
                className={`pill-badge ${
                  !grossMarginAlert
                    ? 'bg-[#00C853]/10 text-[#00C853]'
                    : 'bg-[#D32F2F]/10 text-[#D32F2F]'
                }`}
              >
                {(grossMarginPct * 100).toFixed(1)}% margin
              </span>
            </div>
            <div className="font-display text-[22px] font-bold text-[#051C2C]">
              {grossMarginAlert ? '🚨 Below 10% Floor' : 'Margin Target Satisfied'}
            </div>
            <p className="text-[12px] text-[#888888]">
              Safeguards contractor insolvency risk. Alert fires if net gross margin falls under 10.0%.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('01_Setup')}
            className="text-[12px] text-[#2251FF] hover:underline font-semibold flex items-center gap-1 pt-2"
          >
            Adjust OHP % in Setup <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
