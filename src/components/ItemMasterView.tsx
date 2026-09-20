import React, { useState } from 'react';
import { MasterItem, CostCategory } from '../types';
import { Search, Plus, Trash2, Filter, Layers } from 'lucide-react';

interface ItemMasterViewProps {
  itemMaster: MasterItem[];
  onUpdateItem: (id: string, updated: Partial<MasterItem>) => void;
  onAddItem: (item: MasterItem) => void;
  onDeleteItem: (id: string) => void;
}

const COST_CATEGORIES: CostCategory[] = [
  'Labour & Material',
  'Labour Only',
  'Material Only',
  'Subcontract',
  'Labour & Plant',
  'Plant Only',
];

const STANDARD_UNITS = ['m²', 'm³', 'm', 'nr', 't', 'item', 'hr'];

export const ItemMasterView: React.FC<ItemMasterViewProps> = ({
  itemMaster,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item draft state
  const [newItemCode, setNewItemCode] = useState('');
  const [newSection, setNewSection] = useState('Groundworks & Foundations');
  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('m²');
  const [newCat, setNewCat] = useState<CostCategory>('Labour & Material');
  const [newWaste, setNewWaste] = useState(0.05);

  const sections = Array.from(new Set(itemMaster.map((i) => i.workSection))).sort();

  const filteredItems = itemMaster.filter((item) => {
    const matchesSearch =
      item.masterItemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.standardDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.workSection.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection = selectedSection === 'ALL' || item.workSection === selectedSection;

    return matchesSearch && matchesSection;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemCode.trim() || !newDesc.trim()) {
      alert('Please provide an Item Code and Description.');
      return;
    }

    const item: MasterItem = {
      id: `im-${Date.now()}`,
      masterItemCode: newItemCode.trim().toUpperCase(),
      workSection: newSection,
      standardDescription: newDesc.trim(),
      standardUnit: newUnit,
      costCategory: newCat,
      defaultWastePct: Number(newWaste) || 0,
      activeStatus: 'Active',
    };

    onAddItem(item);
    setNewItemCode('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8E6]">
        <div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
            02_Item_Master: Standard Cost Item Library (WBS)
          </h1>
          <p className="text-[13px] text-[#888888]">
            Standardized work breakdown structure dictionary and specifications. Acts as immutable anchor for AI takeoff mapping and contractor pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-master-item"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#051C2C] hover:bg-[#051C2C]/90 text-white rounded-[6px] text-[12px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Add Standard Item'}</span>
          </button>
        </div>
      </div>

      {/* Add New Item Expandable Card */}
      {showAddForm && (
        <form
          onSubmit={handleCreateItem}
          className="cost-card p-5 bg-[#F9FAFB] border border-[#2251FF]/20 space-y-4"
        >
          <div className="flex items-center gap-2 font-heading font-bold text-[#051C2C] text-[16px]">
            <Layers className="w-4 h-4 text-[#2251FF]" />
            Register New Master Cost Item
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                Item Code (PK)
              </label>
              <input
                type="text"
                placeholder="e.g. MAS-004"
                value={newItemCode}
                onChange={(e) => setNewItemCode(e.target.value)}
                className="cell-editable w-full px-2.5 py-1.5 text-[12px]"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                Work Section (WBS)
              </label>
              <select
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="cell-editable w-full px-2.5 py-1.5 text-[12px]"
              >
                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
                <option value="Specialist Subcontract">Specialist Subcontract</option>
                <option value="Mechanical & Electrical">Mechanical & Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                Unit
              </label>
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="cell-editable w-full px-2.5 py-1.5 text-[12px]"
              >
                {STANDARD_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                Cost Category
              </label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as CostCategory)}
                className="cell-editable w-full px-2.5 py-1.5 text-[12px]"
              >
                {COST_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
                Default Waste %
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="0.5"
                value={newWaste}
                onChange={(e) => setNewWaste(parseFloat(e.target.value) || 0)}
                className="cell-editable w-full px-2.5 py-1.5 text-[12px] text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
              Standard Specification & Description
            </label>
            <input
              type="text"
              placeholder="e.g. 100mm rigid floor insulation PIR boards with staggered taped joints"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="cell-editable w-full px-3 py-1.5 text-[13px]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-[12px] text-[#888888] hover:text-[#051C2C]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2251FF] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#2251FF]/90"
            >
              Save to Master
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            id="search-master-items"
            type="text"
            placeholder="Search code, description, or WBS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-white border border-[#E8E8E6] rounded-[6px] focus:outline-none focus:border-[#2251FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#888888]" />
          <select
            id="filter-master-section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-1.5 text-[12px] bg-white border border-[#E8E8E6] rounded-[6px] text-[#051C2C] focus:outline-none focus:border-[#2251FF]"
          >
            <option value="ALL">All Work Sections ({itemMaster.length})</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="cost-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="table-header-cell px-4 py-3 w-28">Item Code</th>
                <th className="table-header-cell px-4 py-3 w-48">Work Section</th>
                <th className="table-header-cell px-4 py-3 min-w-[280px]">Standard Specification</th>
                <th className="table-header-cell px-3 py-3 w-20 text-center">Unit</th>
                <th className="table-header-cell px-4 py-3 w-36">Category</th>
                <th className="table-header-cell px-3 py-3 w-24 text-right">Std Waste</th>
                <th className="table-header-cell px-3 py-3 w-24 text-center">Status</th>
                <th className="table-header-cell px-3 py-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6] text-[13px]">
              {filteredItems.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-[#051C2C]/[0.02] transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F2]/40'
                  }`}
                >
                  {/* Item Code */}
                  <td className="px-4 py-2.5 font-mono font-bold text-[#051C2C]">
                    {item.masterItemCode}
                  </td>

                  {/* Work Section */}
                  <td className="px-4 py-2.5 text-[#051C2C] font-medium text-[12px]">
                    {item.workSection}
                  </td>

                  {/* Description (Editable inline) */}
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      value={item.standardDescription}
                      onChange={(e) => onUpdateItem(item.id, { standardDescription: e.target.value })}
                      className="cell-editable w-full px-2 py-1 text-[13px]"
                    />
                  </td>

                  {/* Unit (Editable select) */}
                  <td className="px-3 py-2.5 text-center font-mono">
                    <select
                      value={item.standardUnit}
                      onChange={(e) => onUpdateItem(item.id, { standardUnit: e.target.value })}
                      className="cell-editable px-1.5 py-0.5 text-[12px] text-center"
                    >
                      {STANDARD_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Cost Category */}
                  <td className="px-4 py-2.5">
                    <span className="pill-badge text-[11px] bg-[#051C2C]/5 text-[#051C2C]">
                      {item.costCategory}
                    </span>
                  </td>

                  {/* Default Waste % (Editable) */}
                  <td className="px-3 py-2.5 text-right font-mono">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="0.5"
                      value={item.defaultWastePct}
                      onChange={(e) =>
                        onUpdateItem(item.id, { defaultWastePct: parseFloat(e.target.value) || 0 })
                      }
                      className="cell-editable w-16 px-1.5 py-0.5 text-right text-[12px]"
                    />
                  </td>

                  {/* Active Status Toggle (Interactive cell) */}
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateItem(item.id, {
                          activeStatus: item.activeStatus === 'Active' ? 'Archived' : 'Active',
                        })
                      }
                      className={`pill-badge cell-interactive cursor-pointer ${
                        item.activeStatus === 'Active'
                          ? 'bg-[#00C853]/10 text-[#00C853]'
                          : 'bg-[#888888]/15 text-[#888888]'
                      }`}
                      title="Click to toggle active/archived state"
                    >
                      {item.activeStatus}
                    </button>
                  </td>

                  {/* Delete Action */}
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove master item ${item.masterItemCode}?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="text-[#888888] hover:text-[#D32F2F] transition-colors p-1"
                      title="Delete master item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#888888]">
                    No items found matching your filter criteria.
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
