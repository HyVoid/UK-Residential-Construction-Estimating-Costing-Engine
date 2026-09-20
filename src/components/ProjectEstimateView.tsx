import React, { useState } from 'react';
import {
  CalculatedTakeoffItem,
  TakeoffRow,
  MasterItem,
  ProjectSetup,
} from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';
import {
  Plus,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface ProjectEstimateViewProps {
  calculatedRows: CalculatedTakeoffItem[];
  itemMaster: MasterItem[];
  setup: ProjectSetup;
  onUpdateRow: (id: string, updated: Partial<TakeoffRow>) => void;
  onAddRow: (newRow?: Partial<TakeoffRow>) => void;
  onDeleteRow: (id: string) => void;
  onOpenCsvImport: () => void;
}

export const ProjectEstimateView: React.FC<ProjectEstimateViewProps> = ({
  calculatedRows,
  itemMaster,
  setup,
  onUpdateRow,
  onAddRow,
  onDeleteRow,
  onOpenCsvImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('ALL');

  const sections = Array.from(new Set(itemMaster.map((i) => i.workSection))).sort();

  const filteredRows = calculatedRows.filter((row) => {
    const matchesSection = sectionFilter === 'ALL' || row.workSection === sectionFilter;
    const matchesSearch =
      row.takeoffItemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.standardDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.locationRef.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  // Calculate totals
  const totalDirectCost = calculatedRows.reduce((acc, r) => acc + r.lineDirectCostTotal, 0);
  const totalLabour = calculatedRows.reduce((acc, r) => acc + r.lineLabourCost, 0);
  const totalMaterial = calculatedRows.reduce((acc, r) => acc + r.lineMaterialCost, 0);
  const totalSubcontract = calculatedRows.reduce((acc, r) => acc + r.lineSubcontractCost, 0);
  const totalPlant = calculatedRows.reduce((acc, r) => acc + r.linePlantCost, 0);

  const maxLineCost = Math.max(...calculatedRows.map((r) => r.lineDirectCostTotal), 1000);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8E6]">
        <div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
            04_Project_Estimate: Direct Costing Engine
          </h1>
          <p className="text-[13px] text-[#888888]">
            Primary takeoff workspace. Enter Item Codes and Measured Quantities; formulas automatically map WBS attributes, apply waste multipliers, and pull {setup.selectedContractor} rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-quick-csv"
            onClick={onOpenCsvImport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E8E6] hover:bg-[#F5F5F2] text-[#051C2C] rounded-[6px] text-[12px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2251FF]" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            id="btn-add-takeoff-row"
            onClick={() => onAddRow()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#051C2C] hover:bg-[#051C2C]/90 text-white rounded-[6px] text-[12px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Takeoff Row</span>
          </button>
        </div>
      </div>

      {/* Hero KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="cost-card p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1">
            Total Direct Cost
          </div>
          <div className="font-display text-[22px] sm:text-[26px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(totalDirectCost, setup.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#888888] mt-1">
            {calculatedRows.length} takeoff line items
          </div>
        </div>

        <div className="cost-card p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1">
            Direct Labour
          </div>
          <div className="font-display text-[20px] sm:text-[24px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(totalLabour, setup.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#888888] mt-1">
            {totalDirectCost > 0 ? ((totalLabour / totalDirectCost) * 100).toFixed(1) : 0}% of direct
          </div>
        </div>

        <div className="cost-card p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1">
            Direct Material
          </div>
          <div className="font-display text-[20px] sm:text-[24px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(totalMaterial, setup.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#888888] mt-1">
            {totalDirectCost > 0 ? ((totalMaterial / totalDirectCost) * 100).toFixed(1) : 0}% of direct
          </div>
        </div>

        <div className="cost-card p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1">
            Direct Subcontract
          </div>
          <div className="font-display text-[20px] sm:text-[24px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(totalSubcontract, setup.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#888888] mt-1">
            {totalDirectCost > 0 ? ((totalSubcontract / totalDirectCost) * 100).toFixed(1) : 0}% of direct
          </div>
        </div>

        <div className="cost-card p-4 col-span-2 lg:col-span-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1">
            Direct Plant & Tooling
          </div>
          <div className="font-display text-[20px] sm:text-[24px] font-bold text-[#051C2C] leading-none">
            {formatCurrency(totalPlant, setup.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#888888] mt-1">
            {totalDirectCost > 0 ? ((totalPlant / totalDirectCost) * 100).toFixed(1) : 0}% of direct
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            id="search-takeoff"
            type="text"
            placeholder="Search takeoff code, description, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-white border border-[#E8E8E6] rounded-[6px] focus:outline-none focus:border-[#2251FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#888888]" />
          <select
            id="filter-takeoff-section"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-1.5 text-[12px] bg-white border border-[#E8E8E6] rounded-[6px] text-[#051C2C] focus:outline-none focus:border-[#2251FF]"
          >
            <option value="ALL">All Sections ({calculatedRows.length})</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="cost-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr>
                <th className="table-header-cell px-3 py-3 w-28">Item Code</th>
                <th className="table-header-cell px-3 py-3 w-24 text-right">Measured Qty</th>
                <th className="table-header-cell px-3 py-3 w-40">Location / Ref</th>
                <th className="table-header-cell px-3 py-3 min-w-[200px]">Specification</th>
                <th className="table-header-cell px-2 py-3 w-14 text-center">Unit</th>
                <th className="table-header-cell px-2 py-3 w-20 text-right">Eff. Waste</th>
                <th className="table-header-cell px-3 py-3 w-24 text-right">Net Qty</th>
                <th className="table-header-cell px-3 py-3 w-24 text-right">Unit Rate</th>
                <th className="table-header-cell px-3 py-3 w-28 text-right">Override Rate</th>
                <th className="table-header-cell px-4 py-3 w-36 text-right">Direct Cost</th>
                <th className="table-header-cell px-2 py-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6]">
              {filteredRows.map((row, idx) => {
                const barPercent = Math.min(
                  100,
                  Math.max(2, (row.lineDirectCostTotal / maxLineCost) * 100)
                );

                const hasAnomaly = row.hasError;
                const isOverridden =
                  row.rateOverrideValue !== null &&
                  row.rateOverrideValue !== undefined &&
                  !isNaN(row.rateOverrideValue);

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      hasAnomaly
                        ? 'bg-[var(--anomaly-bg)]'
                        : idx % 2 === 0
                        ? 'bg-white'
                        : 'bg-[#F5F5F2]/40'
                    } hover:bg-[#051C2C]/[0.02]`}
                  >
                    {/* Item Code (Editable input with datalist) */}
                    <td className="px-3 py-2 font-mono font-bold">
                      <input
                        type="text"
                        list="master-code-options"
                        value={row.takeoffItemCode}
                        onChange={(e) =>
                          onUpdateRow(row.id, { takeoffItemCode: e.target.value.toUpperCase() })
                        }
                        className="cell-editable w-full px-2 py-1 font-mono font-bold text-[12px]"
                      />
                      {hasAnomaly && (
                        <div className="text-[10px] text-[var(--color-negative)] font-normal truncate mt-0.5">
                          {row.errorMessage}
                        </div>
                      )}
                    </td>

                    {/* Measured Quantity (Editable) */}
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={row.measuredQuantity}
                        onChange={(e) =>
                          onUpdateRow(row.id, {
                            measuredQuantity: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="cell-editable w-20 px-1.5 py-1 text-right font-mono text-[12px]"
                      />
                    </td>

                    {/* Location Ref (Editable) */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="e.g. Ground Floor Extension"
                        value={row.locationRef}
                        onChange={(e) => onUpdateRow(row.id, { locationRef: e.target.value })}
                        className="cell-editable w-full px-2 py-1 text-[12px]"
                      />
                    </td>

                    {/* Specification (Auto-mapped) */}
                    <td className="px-3 py-2 text-[#051C2C]">
                      <div className="font-medium text-[12px] truncate max-w-[240px]" title={row.standardDescription}>
                        {row.standardDescription}
                      </div>
                      <div className="text-[10px] text-[#888888]">{row.workSection}</div>
                    </td>

                    {/* Unit */}
                    <td className="px-2 py-2 text-center font-mono text-[12px] text-[#051C2C]">
                      {row.standardUnit}
                    </td>

                    {/* Effective Waste % */}
                    <td className="px-2 py-2 text-right font-mono text-[11px] text-[#051C2C]">
                      <div>{formatPercent(row.effectiveWasteRate, 1)}</div>
                      {row.wasteOverridePct !== null && row.wasteOverridePct !== undefined && (
                        <span className="text-[9px] text-[#2251FF] font-semibold">Override</span>
                      )}
                    </td>

                    {/* Net Calculated Quantity */}
                    <td className="px-3 py-2 text-right font-mono font-medium text-[#051C2C]">
                      {row.netCalculatedQuantity.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Total Unit Rate */}
                    <td className="px-3 py-2 text-right font-mono">
                      <div className="font-bold text-[#051C2C]">
                        {formatCurrency(row.totalUnitRate, setup.currencySymbol)}
                      </div>
                      <div className="text-[10px] text-[#888888]">
                        L:{formatCurrency(row.matchedLabourRate, setup.currencySymbol)} M:
                        {formatCurrency(row.matchedMaterialRate, setup.currencySymbol)}
                      </div>
                    </td>

                    {/* Rate Override (Editable Escape Hatch) */}
                    <td className="px-3 py-2 text-right font-mono">
                      <input
                        type="number"
                        step="1"
                        placeholder="Auto"
                        value={row.rateOverrideValue ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseFloat(e.target.value);
                          onUpdateRow(row.id, { rateOverrideValue: val });
                        }}
                        className={`cell-editable w-20 px-1.5 py-1 text-right text-[11px] ${
                          isOverridden ? 'font-bold text-[#2251FF]' : ''
                        }`}
                      />
                      {isOverridden && (
                        <input
                          type="text"
                          placeholder="Reason required"
                          value={row.overrideReason || ''}
                          onChange={(e) => onUpdateRow(row.id, { overrideReason: e.target.value })}
                          className="cell-editable w-full px-1.5 py-0.5 text-[9px] mt-1"
                        />
                      )}
                    </td>

                    {/* Direct Cost Line Total with Inline Data Bar */}
                    <td className="px-4 py-2 text-right">
                      <div className="font-mono font-bold text-[#051C2C] text-[13px]">
                        {formatCurrency(row.lineDirectCostTotal, setup.currencySymbol)}
                      </div>
                      {/* Inline Data Bar */}
                      <div className="w-full h-1.5 bg-[#051C2C]/10 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${barPercent}%`,
                            backgroundColor: 'var(--color-accent)',
                          }}
                        />
                      </div>
                    </td>

                    {/* Delete Action */}
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteRow(row.id)}
                        className="text-[#888888] hover:text-[#D32F2F] transition-colors p-1"
                        title="Remove takeoff row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-[#888888]">
                    No takeoff lines recorded. Click "Add Takeoff Row" or "Bulk CSV Import" to begin.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Total Row */}
            {filteredRows.length > 0 && (
              <tfoot>
                <tr className="bg-[#F5F5F2] font-semibold text-[#051C2C] border-t-2 border-[#051C2C]/20">
                  <td colSpan={9} className="px-4 py-3 text-right uppercase tracking-wider text-[12px]">
                    Subtotal Direct Costs:
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[15px] font-bold text-[#051C2C]">
                    {formatCurrency(
                      filteredRows.reduce((acc, r) => acc + r.lineDirectCostTotal, 0),
                      setup.currencySymbol
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Datalist for autocomplete */}
      <datalist id="master-code-options">
        {itemMaster.map((im) => (
          <option key={im.id} value={im.masterItemCode}>
            {im.workSection} — {im.standardDescription}
          </option>
        ))}
      </datalist>
    </div>
  );
};
