import React from 'react';
import { ProjectSetup, ContractorRate } from '../types';
import { Sliders, Building2, ShieldCheck, HelpCircle, UserCheck } from 'lucide-react';

interface SetupViewProps {
  setup: ProjectSetup;
  rateLibrary: ContractorRate[];
  onUpdateSetup: (updated: Partial<ProjectSetup>) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ setup, rateLibrary, onUpdateSetup }) => {
  // Extract unique list of contractors from Rate Library dynamically
  const contractors = Array.from(
    new Set(rateLibrary.map((r) => r.contractorName.trim()))
  ).filter(Boolean);

  if (contractors.length === 0 && setup.selectedContractor) {
    contractors.push(setup.selectedContractor);
  }

  const handleChange = (field: keyof ProjectSetup, value: any) => {
    onUpdateSetup({ [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E8E6]">
        <div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
            01_Setup: Global Parameters & Project Console
          </h1>
          <p className="text-[13px] text-[#888888]">
            Master configuration controlling multi-contractor rate selection, commercial markups, and statutory parameters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill-badge bg-[#051C2C]/5 text-[#051C2C]">
            <Building2 className="w-3.5 h-3.5 text-[#2251FF]" />
            Active Contractor: <strong className="ml-1 text-[#2251FF]">{setup.selectedContractor}</strong>
          </span>
        </div>
      </div>

      {/* Insight Block */}
      <div className="insight-block p-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#2251FF] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#051C2C]">
            <strong>Zero-Hardcoding Parameter Control:</strong> All calculation layers in this workbook pull from this
            central console. Switching the <em>Selected Contractor</em> immediately remaps all unit rates and recalculates
            the direct costs across all work sections. Changes to <em>OHP %</em> and <em>Contingency %</em> recalculate the entire internal commercial cascade.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Commercial & Calculation Parameters */}
        <div className="cost-card p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E8E6]">
            <Sliders className="w-4 h-4 text-[#2251FF]" />
            <h2 className="font-heading text-[18px] font-bold text-[#051C2C]">
              Commercial & Estimating Parameters
            </h2>
          </div>

          <div className="space-y-4">
            {/* Selected Contractor */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  Target Contractor ($C$5)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Selects active rate table in 03_Rate_Library for direct costing
                </p>
              </div>
              <select
                id="setup-selected-contractor"
                value={setup.selectedContractor}
                onChange={(e) => handleChange('selectedContractor', e.target.value)}
                className="cell-editable px-3 py-1.5 text-[13px] font-medium min-w-[220px]"
              >
                {contractors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Symbol */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  Currency Symbol ($C$4)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Broadcast across all currency displays and headers
                </p>
              </div>
              <select
                id="setup-currency-symbol"
                value={setup.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="cell-editable px-3 py-1.5 text-[13px] font-medium min-w-[100px]"
              >
                <option value="£">£ (GBP - British Pound)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="$">$ (USD - US Dollar)</option>
              </select>
            </div>

            {/* Default Waste Rate */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  Global Default Material Waste % ($C$6)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Fallback waste multiplier applied when no item override exists
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="setup-default-waste-rate"
                  type="number"
                  step="0.005"
                  min="0"
                  max="0.5"
                  value={setup.defaultWasteRate}
                  onChange={(e) => handleChange('defaultWasteRate', parseFloat(e.target.value) || 0)}
                  className="cell-editable px-3 py-1.5 text-[13px] text-right font-medium w-24"
                />
                <span className="text-[12px] text-[#888888]">
                  ({(setup.defaultWasteRate * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Preliminaries Mode & Rate */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  Preliminaries Costing Mode ($C$7)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Direct cost percentage or itemized site prelims from Sheet 05
                </p>
              </div>
              <select
                id="setup-prelims-mode"
                value={setup.prelimsMode}
                onChange={(e) => handleChange('prelimsMode', e.target.value)}
                className="cell-editable px-3 py-1.5 text-[13px] font-medium min-w-[180px]"
              >
                <option value="% of Direct Cost">% of Direct Cost</option>
                <option value="Fixed Adjustments">Fixed Adjustments (Sheet 05)</option>
              </select>
            </div>

            {setup.prelimsMode === '% of Direct Cost' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pl-3 border-l-2 border-[#2251FF]/20">
                <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                    Preliminaries Rate % ($C$8)
                  </label>
                  <p className="text-[11px] text-[#888888]">Site supervision, skip hire & welfare percentage</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    id="setup-prelims-pct"
                    type="number"
                    step="0.005"
                    min="0"
                    max="0.5"
                    value={setup.prelimsPct}
                    onChange={(e) => handleChange('prelimsPct', parseFloat(e.target.value) || 0)}
                    className="cell-editable px-3 py-1.5 text-[13px] text-right font-medium w-24"
                  />
                  <span className="text-[12px] text-[#888888]">
                    ({(setup.prelimsPct * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Overhead & Profit (OHP) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  Overhead & Profit (OHP %) ($C$9)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Contractor commercial margin applied to Prime Cost
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="setup-ohp-pct"
                  type="number"
                  step="0.005"
                  min="0"
                  max="0.6"
                  value={setup.ohpPct}
                  onChange={(e) => handleChange('ohpPct', parseFloat(e.target.value) || 0)}
                  className="cell-editable px-3 py-1.5 text-[13px] text-right font-medium w-24"
                />
                <span className="text-[12px] text-[#888888]">
                  ({(setup.ohpPct * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Contingency % */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  Contingency Risk Reserve % ($C$10)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Unforeseen site condition buffer applied to Prime Cost
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="setup-contingency-pct"
                  type="number"
                  step="0.005"
                  min="0"
                  max="0.4"
                  value={setup.contingencyPct}
                  onChange={(e) => handleChange('contingencyPct', parseFloat(e.target.value) || 0)}
                  className="cell-editable px-3 py-1.5 text-[13px] text-right font-medium w-24"
                />
                <span className="text-[12px] text-[#888888]">
                  ({(setup.contingencyPct * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* VAT Rate */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  UK Construction VAT Rate ($C$11)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Standard residential construction rate (default 20.0%)
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="setup-vat-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="0.3"
                  value={setup.vatRate}
                  onChange={(e) => handleChange('vatRate', parseFloat(e.target.value) || 0)}
                  className="cell-editable px-3 py-1.5 text-[13px] text-right font-medium w-24"
                />
                <span className="text-[12px] text-[#888888]">
                  ({(setup.vatRate * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Gross Floor Area (GFA) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C]">
                  Total Gross Floor Area (GFA m²)
                </label>
                <p className="text-[11px] text-[#888888]">
                  Used to benchmark £/m² construction cost intensity
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="setup-gfa"
                  type="number"
                  step="1"
                  min="1"
                  value={setup.grossFloorAreaSqm}
                  onChange={(e) => handleChange('grossFloorAreaSqm', parseFloat(e.target.value) || 1)}
                  className="cell-editable px-3 py-1.5 text-[13px] text-right font-medium w-24"
                />
                <span className="text-[12px] text-[#888888]">m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Project Metadata & Governance */}
        <div className="cost-card p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E8E6]">
            <UserCheck className="w-4 h-4 text-[#2251FF]" />
            <h2 className="font-heading text-[18px] font-bold text-[#051C2C]">
              Project Governance & Metadata
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] mb-1">
                Project Name ($C$14)
              </label>
              <input
                id="setup-project-name"
                type="text"
                value={setup.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                className="cell-editable w-full px-3 py-1.5 text-[13px] font-medium"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] mb-1">
                Client / Employer Name ($C$15)
              </label>
              <input
                id="setup-client-name"
                type="text"
                value={setup.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                className="cell-editable w-full px-3 py-1.5 text-[13px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] mb-1">
                Project Classification ($C$16)
              </label>
              <input
                id="setup-project-type"
                type="text"
                value={setup.projectType}
                onChange={(e) => handleChange('projectType', e.target.value)}
                className="cell-editable w-full px-3 py-1.5 text-[13px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] mb-1">
                Site Location & Postcode ($C$17)
              </label>
              <input
                id="setup-location"
                type="text"
                value={setup.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="cell-editable w-full px-3 py-1.5 text-[13px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] mb-1">
                  Estimate Date ($C$18)
                </label>
                <input
                  id="setup-estimate-date"
                  type="date"
                  value={setup.estimateDate}
                  onChange={(e) => handleChange('estimateDate', e.target.value)}
                  className="cell-editable w-full px-3 py-1.5 text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] mb-1">
                  Revision Version ($C$20)
                </label>
                <input
                  id="setup-project-version"
                  type="text"
                  value={setup.projectVersion}
                  onChange={(e) => handleChange('projectVersion', e.target.value)}
                  className="cell-editable w-full px-3 py-1.5 text-[13px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] mb-1">
                Lead Estimator / Chartered QS ($C$19)
              </label>
              <input
                id="setup-estimator-name"
                type="text"
                value={setup.estimatorName}
                onChange={(e) => handleChange('estimatorName', e.target.value)}
                className="cell-editable w-full px-3 py-1.5 text-[13px]"
              />
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-md bg-[#F5F5F2] flex items-center justify-between text-[11px] text-[#888888]">
                <span>Audit Tolerance Threshold:</span>
                <span className="font-mono font-medium text-[#051C2C]">
                  ±{setup.currencySymbol}{setup.toleranceThreshold.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
