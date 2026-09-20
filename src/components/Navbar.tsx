import React, { useRef } from 'react';
import {
  ActiveTab,
  ChecksAuditResult,
  WorkbookState,
} from '../types';
import {
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  state: WorkbookState;
  auditResult: ChecksAuditResult;
  lastSavedFormatted: string;
  onExportBackup: () => void;
  onImportBackup: (imported: WorkbookState) => void;
  onOpenCsvImport: () => void;
  onResetData: () => void;
}

const TAB_CONFIG: { id: ActiveTab; label: string; shortLabel: string }[] = [
  { id: '01_Setup', label: '01 Setup', shortLabel: 'Setup' },
  { id: '02_Item_Master', label: '02 Item Master', shortLabel: 'Item Master' },
  { id: '03_Rate_Library', label: '03 Rate Library', shortLabel: 'Rate Library' },
  { id: '04_Project_Estimate', label: '04 Project Estimate', shortLabel: 'Estimate' },
  { id: '05_Adjustments', label: '05 Adjustments', shortLabel: 'Adjustments' },
  { id: '06_Internal_Estimate', label: '06 Internal View', shortLabel: 'Internal' },
  { id: '07_Customer_Estimate', label: '07 Customer Quote', shortLabel: 'Customer' },
  { id: '08_Checks', label: '08 Audit Checks', shortLabel: 'Checks' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  state,
  auditResult,
  lastSavedFormatted,
  onExportBackup,
  onImportBackup,
  onOpenCsvImport,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.setup && Array.isArray(json.itemMaster) && Array.isArray(json.projectEstimate)) {
          onImportBackup(json);
        } else {
          alert('Invalid backup file format. Missing essential workbook schema.');
        }
      } catch (err) {
        alert('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const totalWarnings =
    auditResult.unmappedCodesCount +
    auditResult.missingRatesCount +
    auditResult.duplicateMasterCodesCount +
    (auditResult.grossMarginAlert ? 1 : 0) +
    (auditResult.balanceIntegrityStatus === 'FAIL' ? 1 : 0);

  return (
    <header
      id="app-navbar"
      className="sticky top-0 z-40 bg-white border-b border-[#E8E8E6] shadow-sm select-none"
      style={{ height: '56px' }}
    >
      <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-2">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#051C2C] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            £
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-[#051C2C] text-[15px] sm:text-[16px] leading-tight">
                Costing Engine
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] uppercase font-semibold text-[#2251FF] bg-[#2251FF]/10 rounded">
                SaaS v2.4
              </span>
            </div>
            <span className="text-[11px] text-[#888888] leading-tight truncate max-w-[180px] sm:max-w-[260px]">
              {state.setup.projectName || 'UK Residential Costing'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center overflow-x-auto no-scrollbar h-full space-x-1 sm:space-x-2">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            const isChecks = tab.id === '08_Checks';

            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative h-full px-2.5 sm:px-3 flex items-center text-[12px] sm:text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#051C2C] font-semibold'
                    : 'text-[#051C2C]/60 hover:text-[#051C2C]'
                }`}
              >
                <span>{tab.label}</span>
                {isChecks && totalWarnings > 0 && (
                  <span
                    className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#D32F2F] text-white"
                    title={`${totalWarnings} audit issues flagged`}
                  >
                    {totalWarnings}
                  </span>
                )}
                {isChecks && totalWarnings === 0 && (
                  <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-[#00C853]" />
                )}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-sm"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Auto-save status, Backup & Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Last Saved Badge */}
          <div
            id="last-saved-badge"
            className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-[#F5F5F2] text-[11px] text-[#888888]"
            title={`Auto-saved to localStorage: ${state.lastSaved}`}
          >
            <Clock className="w-3.5 h-3.5 text-[#00C853]" />
            <span>Saved: {lastSavedFormatted}</span>
          </div>

          {/* Bulk CSV Import Button */}
          <button
            id="btn-bulk-csv-import"
            onClick={onOpenCsvImport}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-[12px] font-medium text-[#051C2C] bg-[#F5F5F2] hover:bg-[#E8E8E6] rounded-[6px] transition-colors cursor-pointer"
            title="Bulk import CSV data into project takeoff"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2251FF]" />
            <span className="hidden lg:inline">CSV Import</span>
          </button>

          {/* Export Backup */}
          <button
            id="btn-export-backup"
            onClick={onExportBackup}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-[12px] font-medium text-[#051C2C] bg-[#F5F5F2] hover:bg-[#E8E8E6] rounded-[6px] transition-colors cursor-pointer"
            title="Export complete workbook backup as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#051C2C]" />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* Import Backup */}
          <button
            id="btn-import-backup"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-[12px] font-medium text-[#051C2C] bg-[#F5F5F2] hover:bg-[#E8E8E6] rounded-[6px] transition-colors cursor-pointer"
            title="Import workbook backup from JSON file"
          >
            <Upload className="w-3.5 h-3.5 text-[#051C2C]" />
            <span className="hidden lg:inline">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset Data */}
          <button
            id="btn-reset-data"
            onClick={onResetData}
            className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-[12px] font-medium text-[#888888] hover:text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded-[6px] transition-colors cursor-pointer"
            title="Reset workbook to standard baseline seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
