import React, { useState } from 'react';
import { AdjustmentItem, AdjustmentCategory, CostBasisType } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Plus, Trash2, HelpCircle, HardHat, DollarSign } from 'lucide-react';

interface AdjustmentsViewProps {
  adjustments: AdjustmentItem[];
  currencySymbol: string;
  prelimsMode: string;
  onUpdateAdjustment: (id: string, updated: Partial<AdjustmentItem>) => void;
  onAddAdjustment: (item: AdjustmentItem) => void;
  onDeleteAdjustment: (id: string) => void;
}

const CATEGORIES: AdjustmentCategory[] = ['Preliminaries', 'Provisional Sums', 'Site Allowance'];
const BASIS_TYPES: CostBasisType[] = ['Fixed Lump Sum', 'Weekly Rate', 'Unit Rate'];

export const AdjustmentsView: React.FC<AdjustmentsViewProps> = ({
  adjustments,
  currencySymbol,
  prelimsMode,
  onUpdateAdjustment,
  onAddAdjustment,
  onDeleteAdjustment,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const prelimsTotal = adjustments
    .filter((a) => a.adjustmentCategory === 'Preliminaries')
    .reduce((acc, a) => acc + (Number(a.inputQuantityDuration) || 0) * (Number(a.inputUnitRate) || 0), 0);

  const provisionalTotal = adjustments
    .filter((a) => a.adjustmentCategory === 'Provisional Sums')
    .reduce((acc, a) => acc + (Number(a.inputQuantityDuration) || 0) * (Number(a.inputUnitRate) || 0), 0);

  const filteredAdjustments = adjustments.filter(
    (a) => activeCategory === 'ALL' || a.adjustmentCategory === activeCategory
  );

  const handleAddNew = (category: AdjustmentCategory = 'Preliminaries') => {
    const newItem: AdjustmentItem = {
      id: `adj-${Date.now()}`,
      adjustmentCategory: category,
      adjustmentDescription: 'New site preliminary or provisional sum allowance',
      costBasisType: 'Weekly Rate',
      inputQuantityDuration: 1,
      inputUnitRate: 500,
      notes: 'Estimator note',
    };
    onAddAdjustment(newItem);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8E6]">
        <div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
            05_Adjustments: Site Preliminaries & Provisional Sums
          </h1>
          <p className="text-[13px] text-[#888888]">
            Non-standardized indirect cost center for site setup, health & safety welfare, scaffold access, and client contingency allowances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddNew('Preliminaries')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#051C2C] hover:bg-[#051C2C]/90 text-white rounded-[6px] text-[12px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prelim Item</span>
          </button>
          <button
            onClick={() => handleAddNew('Provisional Sums')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2251FF] hover:bg-[#2251FF]/90 text-white rounded-[6px] text-[12px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Provisional Sum</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="cost-card p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1 flex items-center gap-1.5">
              <HardHat className="w-4 h-4 text-[#2251FF]" />
              Preliminaries Subtotal
            </div>
            <div className="font-display text-[24px] sm:text-[28px] font-bold text-[#051C2C]">
              {formatCurrency(prelimsTotal, currencySymbol)}
            </div>
            <div className="text-[11px] text-[#888888] mt-1">
              Active Mode: <strong className="text-[#051C2C]">{prelimsMode}</strong>
            </div>
          </div>
          <span className="pill-badge bg-[#051C2C]/5 text-[#051C2C]">
            {adjustments.filter((a) => a.adjustmentCategory === 'Preliminaries').length} items
          </span>
        </div>

        <div className="cost-card p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#00C853]" />
              Provisional Sums Subtotal
            </div>
            <div className="font-display text-[24px] sm:text-[28px] font-bold text-[#051C2C]">
              {formatCurrency(provisionalTotal, currencySymbol)}
            </div>
            <div className="text-[11px] text-[#888888] mt-1">
              Reserved client packages (Kitchen, Bathrooms, Ground Unknowns)
            </div>
          </div>
          <span className="pill-badge bg-[#00C853]/10 text-[#00C853]">
            {adjustments.filter((a) => a.adjustmentCategory === 'Provisional Sums').length} defined packages
          </span>
        </div>
      </div>

      {/* Insight Block */}
      <div className="insight-block p-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#2251FF] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#051C2C]">
            <strong>UK Construction Contracting Discipline:</strong> Preliminaries cover contractor site running expenses
            (welfare, temporary power, scaffold licences). Provisional Sums represent defined budget allocations for
            works whose detailed design or final choice will be selected post-contract by the client.
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors cursor-pointer ${
            activeCategory === 'ALL' ? 'bg-[#051C2C] text-white' : 'bg-[#F5F5F2] text-[#051C2C]'
          }`}
        >
          All Items ({adjustments.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors cursor-pointer ${
              activeCategory === cat ? 'bg-[#2251FF] text-white' : 'bg-[#F5F5F2] text-[#051C2C]'
            }`}
          >
            {cat} ({adjustments.filter((a) => a.adjustmentCategory === cat).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="cost-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="table-header-cell px-4 py-3 w-40">Category</th>
                <th className="table-header-cell px-4 py-3 min-w-[280px]">Description</th>
                <th className="table-header-cell px-3 py-3 w-36">Basis Type</th>
                <th className="table-header-cell px-3 py-3 w-28 text-right">Duration / Qty</th>
                <th className="table-header-cell px-3 py-3 w-28 text-right">Rate / Unit</th>
                <th className="table-header-cell px-4 py-3 w-36 text-right">Line Total</th>
                <th className="table-header-cell px-4 py-3 min-w-[180px]">Notes</th>
                <th className="table-header-cell px-3 py-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6]">
              {filteredAdjustments.map((item, idx) => {
                const total = (Number(item.inputQuantityDuration) || 0) * (Number(item.inputUnitRate) || 0);

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#051C2C]/[0.02] transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F2]/40'
                    }`}
                  >
                    {/* Category */}
                    <td className="px-4 py-2.5">
                      <select
                        value={item.adjustmentCategory}
                        onChange={(e) =>
                          onUpdateAdjustment(item.id, {
                            adjustmentCategory: e.target.value as AdjustmentCategory,
                          })
                        }
                        className="cell-editable px-2 py-1 text-[12px] font-medium"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        value={item.adjustmentDescription}
                        onChange={(e) =>
                          onUpdateAdjustment(item.id, { adjustmentDescription: e.target.value })
                        }
                        className="cell-editable w-full px-2 py-1 text-[13px]"
                      />
                    </td>

                    {/* Basis Type */}
                    <td className="px-3 py-2.5">
                      <select
                        value={item.costBasisType}
                        onChange={(e) =>
                          onUpdateAdjustment(item.id, {
                            costBasisType: e.target.value as CostBasisType,
                          })
                        }
                        className="cell-editable px-2 py-1 text-[12px]"
                      >
                        {BASIS_TYPES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Quantity / Duration */}
                    <td className="px-3 py-2.5 text-right font-mono">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={item.inputQuantityDuration}
                        onChange={(e) =>
                          onUpdateAdjustment(item.id, {
                            inputQuantityDuration: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="cell-editable w-20 px-1.5 py-1 text-right text-[12px]"
                      />
                    </td>

                    {/* Unit Rate */}
                    <td className="px-3 py-2.5 text-right font-mono">
                      <input
                        type="number"
                        step="10"
                        min="0"
                        value={item.inputUnitRate}
                        onChange={(e) =>
                          onUpdateAdjustment(item.id, {
                            inputUnitRate: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="cell-editable w-24 px-1.5 py-1 text-right text-[12px]"
                      />
                    </td>

                    {/* Line Total */}
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-[#051C2C]">
                      {formatCurrency(total, currencySymbol)}
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        placeholder="Assumption / specification..."
                        value={item.notes || ''}
                        onChange={(e) => onUpdateAdjustment(item.id, { notes: e.target.value })}
                        className="cell-editable w-full px-2 py-1 text-[12px]"
                      />
                    </td>

                    {/* Delete */}
                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteAdjustment(item.id)}
                        className="text-[#888888] hover:text-[#D32F2F] transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredAdjustments.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#888888]">
                    No adjustment items recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
