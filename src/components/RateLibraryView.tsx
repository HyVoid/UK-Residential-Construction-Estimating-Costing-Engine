import React, { useState } from 'react';
import { ContractorRate, MasterItem } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Search, Plus, Trash2, Filter, Users, Calendar } from 'lucide-react';

interface RateLibraryViewProps {
  rateLibrary: ContractorRate[];
  itemMaster: MasterItem[];
  currencySymbol: string;
  selectedContractor: string;
  onUpdateRate: (id: string, updated: Partial<ContractorRate>) => void;
  onAddRate: (rate: ContractorRate) => void;
  onDeleteRate: (id: string) => void;
  onSelectContractor: (contractor: string) => void;
}

export const RateLibraryView: React.FC<RateLibraryViewProps> = ({
  rateLibrary,
  itemMaster,
  currencySymbol,
  selectedContractor,
  onUpdateRate,
  onAddRate,
  onDeleteRate,
  onSelectContractor,
}) => {
  const [activeContractorFilter, setActiveContractorFilter] = useState<string>(selectedContractor);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New rate draft
  const [newContractor, setNewContractor] = useState(selectedContractor);
  const [newCode, setNewCode] = useState(itemMaster[0]?.masterItemCode || '');
  const [newLabour, setNewLabour] = useState(0);
  const [newMaterial, setNewMaterial] = useState(0);
  const [newSubc, setNewSubc] = useState(0);
  const [newPlant, setNewPlant] = useState(0);
  const [newNotes, setNewNotes] = useState('');

  // Extract contractors
  const contractors = Array.from(new Set(rateLibrary.map((r) => r.contractorName.trim()))).filter(
    Boolean
  );
  if (!contractors.includes(selectedContractor)) contractors.push(selectedContractor);

  // Master descriptions lookup map
  const masterDescMap = new Map(
    itemMaster.map((i) => [i.masterItemCode.toUpperCase(), i.standardDescription])
  );

  const filteredRates = rateLibrary.filter((rate) => {
    const matchesContractor =
      activeContractorFilter === 'ALL' || rate.contractorName === activeContractorFilter;
    const desc = masterDescMap.get(rate.rateItemCode.toUpperCase()) || '';
    const matchesSearch =
      rate.rateItemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.contractorName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesContractor && matchesSearch;
  });

  // Calculate maximum rate for inline data bar proportional scaling
  const maxCompositeRate = Math.max(
    ...rateLibrary.map(
      (r) =>
        (Number(r.baseLabourRate) || 0) +
        (Number(r.baseMaterialRate) || 0) +
        (Number(r.baseSubcontractRate) || 0) +
        (Number(r.plantRate) || 0)
    ),
    100
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContractor.trim() || !newCode.trim()) return;

    const rate: ContractorRate = {
      id: `rl-${Date.now()}`,
      contractorName: newContractor.trim(),
      rateItemCode: newCode.trim().toUpperCase(),
      baseLabourRate: Number(newLabour) || 0,
      baseMaterialRate: Number(newMaterial) || 0,
      baseSubcontractRate: Number(newSubc) || 0,
      plantRate: Number(newPlant) || 0,
      rateEffectiveDate: new Date().toISOString().split('T')[0],
      rateNotes: newNotes.trim() || undefined,
    };

    onAddRate(rate);
    setShowAddModal(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8E6]">
        <div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
            03_Rate_Library: Multi-Contractor Pricing Matrix
          </h1>
          <p className="text-[13px] text-[#888888]">
            Decoupled contractor cost library. Stores discrete Labour, Material, Subcontract, and Plant rates for benchmarked contractors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-rate-entry"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#051C2C] hover:bg-[#051C2C]/90 text-white rounded-[6px] text-[12px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contractor Rate</span>
          </button>
        </div>
      </div>

      {/* Contractor Selector Bar */}
      <div className="cost-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#051C2C] flex items-center gap-1.5 mr-2">
            <Users className="w-4 h-4 text-[#2251FF]" />
            Contractor:
          </span>
          <button
            onClick={() => setActiveContractorFilter('ALL')}
            className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors cursor-pointer ${
              activeContractorFilter === 'ALL'
                ? 'bg-[#051C2C] text-white'
                : 'bg-[#F5F5F2] text-[#051C2C] hover:bg-[#E8E8E6]'
            }`}
          >
            All Contractors ({rateLibrary.length})
          </button>
          {contractors.map((c) => (
            <button
              key={c}
              onClick={() => setActiveContractorFilter(c)}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeContractorFilter === c
                  ? 'bg-[#2251FF] text-white'
                  : 'bg-[#F5F5F2] text-[#051C2C] hover:bg-[#E8E8E6]'
              }`}
            >
              <span>{c}</span>
              {c === selectedContractor && (
                <span className="text-[9px] px-1 bg-white/20 rounded font-semibold uppercase">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>

        {activeContractorFilter !== 'ALL' && activeContractorFilter !== selectedContractor && (
          <button
            onClick={() => onSelectContractor(activeContractorFilter)}
            className="px-3 py-1 bg-[#2251FF]/10 text-[#2251FF] hover:bg-[#2251FF]/20 rounded-[6px] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            Set "{activeContractorFilter}" as Active Estimating Contractor
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            type="text"
            placeholder="Search rate code, description, contractor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-white border border-[#E8E8E6] rounded-[6px] focus:outline-none focus:border-[#2251FF]"
          />
        </div>

        <div className="text-[12px] text-[#888888]">
          Displaying <strong>{filteredRates.length}</strong> benchmarked rates
        </div>
      </div>

      {/* Table */}
      <div className="cost-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="table-header-cell px-4 py-3 w-40">Contractor</th>
                <th className="table-header-cell px-3 py-3 w-28">Item Code</th>
                <th className="table-header-cell px-4 py-3 min-w-[220px]">Specification</th>
                <th className="table-header-cell px-3 py-3 w-24 text-right">Labour</th>
                <th className="table-header-cell px-3 py-3 w-24 text-right">Material</th>
                <th className="table-header-cell px-3 py-3 w-24 text-right">Subcontract</th>
                <th className="table-header-cell px-3 py-3 w-20 text-right">Plant</th>
                <th className="table-header-cell px-4 py-3 w-44 text-right">Composite Rate</th>
                <th className="table-header-cell px-3 py-3 w-28 text-center">Effective</th>
                <th className="table-header-cell px-3 py-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6] text-[13px]">
              {filteredRates.map((rate, idx) => {
                const composite =
                  (Number(rate.baseLabourRate) || 0) +
                  (Number(rate.baseMaterialRate) || 0) +
                  (Number(rate.baseSubcontractRate) || 0) +
                  (Number(rate.plantRate) || 0);

                const desc = masterDescMap.get(rate.rateItemCode.toUpperCase()) || '⚠️ Not in Master';
                const barPercent = Math.min(100, Math.max(3, (composite / maxCompositeRate) * 100));
                const isActiveContractor = rate.contractorName === selectedContractor;

                return (
                  <tr
                    key={rate.id}
                    className={`hover:bg-[#051C2C]/[0.02] transition-colors ${
                      isActiveContractor ? 'bg-blue-50/20' : idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F2]/40'
                    }`}
                  >
                    {/* Contractor */}
                    <td className="px-4 py-2 font-medium text-[#051C2C]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{rate.contractorName}</span>
                        {isActiveContractor && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2251FF] shrink-0" title="Currently selected contractor" />
                        )}
                      </div>
                    </td>

                    {/* Code */}
                    <td className="px-3 py-2 font-mono font-bold text-[#051C2C]">
                      {rate.rateItemCode}
                    </td>

                    {/* Description */}
                    <td className="px-4 py-2 text-[#051C2C]/90 text-[12px] truncate max-w-[260px]" title={desc}>
                      {desc}
                    </td>

                    {/* Labour Rate */}
                    <td className="px-3 py-2 text-right font-mono">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={rate.baseLabourRate}
                        onChange={(e) =>
                          onUpdateRate(rate.id, { baseLabourRate: parseFloat(e.target.value) || 0 })
                        }
                        className="cell-editable w-20 px-1.5 py-0.5 text-right text-[12px]"
                      />
                    </td>

                    {/* Material Rate */}
                    <td className="px-3 py-2 text-right font-mono">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={rate.baseMaterialRate}
                        onChange={(e) =>
                          onUpdateRate(rate.id, { baseMaterialRate: parseFloat(e.target.value) || 0 })
                        }
                        className="cell-editable w-20 px-1.5 py-0.5 text-right text-[12px]"
                      />
                    </td>

                    {/* Subcontract Rate */}
                    <td className="px-3 py-2 text-right font-mono">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={rate.baseSubcontractRate}
                        onChange={(e) =>
                          onUpdateRate(rate.id, { baseSubcontractRate: parseFloat(e.target.value) || 0 })
                        }
                        className="cell-editable w-20 px-1.5 py-0.5 text-right text-[12px]"
                      />
                    </td>

                    {/* Plant Rate */}
                    <td className="px-3 py-2 text-right font-mono">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={rate.plantRate}
                        onChange={(e) =>
                          onUpdateRate(rate.id, { plantRate: parseFloat(e.target.value) || 0 })
                        }
                        className="cell-editable w-16 px-1.5 py-0.5 text-right text-[12px]"
                      />
                    </td>

                    {/* Composite Rate with Inline Data Bar */}
                    <td className="px-4 py-2 text-right">
                      <div className="font-mono font-bold text-[#051C2C] text-[13px]">
                        {formatCurrency(composite, currencySymbol)}
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

                    {/* Effective Date */}
                    <td className="px-3 py-2 text-center font-mono text-[11px] text-[#888888]">
                      {rate.rateEffectiveDate || 'Current'}
                    </td>

                    {/* Delete */}
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove ${rate.rateItemCode} rate for ${rate.contractorName}?`)) {
                            onDeleteRate(rate.id);
                          }
                        }}
                        className="text-[#888888] hover:text-[#D32F2F] transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRates.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-[#888888]">
                    No contractor rates found matching this criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051C2C]/40 backdrop-blur-sm">
          <form
            onSubmit={handleAddSubmit}
            className="cost-card w-full max-w-lg p-6 bg-white space-y-4 shadow-xl animate-fade-up"
          >
            <h2 className="font-heading text-[18px] font-bold text-[#051C2C]">
              Add Contractor Price Record
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                  Contractor Name
                </label>
                <input
                  type="text"
                  list="contractor-list"
                  value={newContractor}
                  onChange={(e) => setNewContractor(e.target.value)}
                  className="cell-editable w-full px-3 py-1.5 text-[13px]"
                  required
                />
                <datalist id="contractor-list">
                  {contractors.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                  Standard Master Item Code
                </label>
                <select
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="cell-editable w-full px-3 py-1.5 text-[13px]"
                >
                  {itemMaster.map((im) => (
                    <option key={im.id} value={im.masterItemCode}>
                      {im.masterItemCode} — {im.standardDescription.slice(0, 45)}... ({im.standardUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                    Labour ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newLabour}
                    onChange={(e) => setNewLabour(parseFloat(e.target.value) || 0)}
                    className="cell-editable w-full px-2 py-1 text-[12px] text-right"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                    Material ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(parseFloat(e.target.value) || 0)}
                    className="cell-editable w-full px-2 py-1 text-[12px] text-right"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                    Subcontract ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={newSubc}
                    onChange={(e) => setNewSubc(parseFloat(e.target.value) || 0)}
                    className="cell-editable w-full px-2 py-1 text-[12px] text-right"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                    Plant ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newPlant}
                    onChange={(e) => setNewPlant(parseFloat(e.target.value) || 0)}
                    className="cell-editable w-full px-2 py-1 text-[12px] text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                  Pricing Assumptions / Scope Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rate includes supply and hoisting into position"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="cell-editable w-full px-3 py-1.5 text-[13px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-[12px] text-[#888888] hover:text-[#051C2C]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2251FF] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#2251FF]/90"
              >
                Commit Rate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
