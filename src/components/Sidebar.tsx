import React, { useRef, useState } from 'react';
import {
  ActiveTab,
  ChecksAuditResult,
  WorkbookState,
} from '../types';
import {
  Sliders,
  Layers,
  Building2,
  Calculator,
  HardHat,
  TrendingUp,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  Clock,
  Menu,
  X,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
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

interface TabItem {
  id: ActiveTab;
  code: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const TAB_CONFIG: TabItem[] = [
  {
    id: '01_Setup',
    code: '01',
    label: 'Setup & Rules',
    description: 'Contractor, rates, OHP & VAT',
    icon: Sliders,
  },
  {
    id: '02_Item_Master',
    code: '02',
    label: 'Item Master',
    description: 'Standard WBS dictionary',
    icon: Layers,
  },
  {
    id: '03_Rate_Library',
    code: '03',
    label: 'Rate Library',
    description: 'Multi-contractor pricing matrix',
    icon: Building2,
  },
  {
    id: '04_Project_Estimate',
    code: '04',
    label: 'Project Estimate',
    description: 'Takeoff & direct costing',
    icon: Calculator,
  },
  {
    id: '05_Adjustments',
    code: '05',
    label: 'Adjustments',
    description: 'Preliminaries & provisional sums',
    icon: HardHat,
  },
  {
    id: '06_Internal_Estimate',
    code: '06',
    label: 'Internal View',
    description: 'Commercial waterfall & margins',
    icon: TrendingUp,
    tag: 'Confidential',
  },
  {
    id: '07_Customer_Estimate',
    code: '07',
    label: 'Customer Quote',
    description: 'External client schedule & PDF',
    icon: FileText,
  },
  {
    id: '08_Checks',
    code: '08',
    label: 'Audit Checks',
    description: '6-point governance verification',
    icon: ShieldCheck,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  const activeTabConfig = TAB_CONFIG.find((t) => t.id === activeTab) || TAB_CONFIG[0];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand & App Title Header */}
      <div className="p-5 border-b border-[#E8E8E6] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#051C2C] text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm shrink-0">
              £
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-[#051C2C] text-[16px] leading-tight tracking-tight">
                  Costing Engine
                </span>
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-semibold text-[#2251FF] bg-[#2251FF]/10 rounded">
                  v2.4
                </span>
              </div>
              <span className="text-[11px] text-[#888888] leading-tight truncate mt-0.5 font-medium">
                RICS & JCT Framework
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-[#888888] hover:text-[#051C2C] hover:bg-[#F5F5F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Context Pill Card */}
        <div className="mt-3.5 p-2.5 rounded-[8px] bg-[#F5F5F2] border border-[#E8E8E6]/60">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#888888]">
            Active Project
          </div>
          <div className="text-[13px] font-bold text-[#051C2C] truncate" title={state.setup.projectName}>
            {state.setup.projectName || 'Residential Extension'}
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-[#888888]">
            <span className="truncate max-w-[120px]">{state.setup.selectedContractor}</span>
            <span className="font-mono font-semibold text-[#051C2C]">{state.setup.currencySymbol} • {state.setup.grossFloorAreaSqm} m²</span>
          </div>
        </div>
      </div>

      {/* Navigation Links - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#888888]">
          Workbook Sheets
        </div>

        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          const isChecks = tab.id === '08_Checks';
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`sidebar-tab-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileOpen(false);
              }}
              className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-[8px] text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#051C2C] text-white shadow-sm'
                  : 'text-[#051C2C]/80 hover:text-[#051C2C] hover:bg-[#F5F5F2]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'bg-[#F5F5F2] text-[#051C2C] group-hover:bg-[#E8E8E6]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isActive ? 'text-white/60' : 'text-[#888888]'
                      }`}
                    >
                      {tab.code}
                    </span>
                    <span className="text-[13px] font-medium leading-tight truncate">
                      {tab.label}
                    </span>
                  </div>
                  <div
                    className={`text-[10px] truncate leading-tight mt-0.5 ${
                      isActive ? 'text-white/70' : 'text-[#888888]'
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
              </div>

              {/* Status / Tag Pill */}
              <div className="shrink-0 ml-2">
                {isChecks && totalWarnings > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#D32F2F] text-white'
                        : 'bg-[#D32F2F]/10 text-[#D32F2F]'
                    }`}
                    title={`${totalWarnings} audit issues flagged`}
                  >
                    {totalWarnings}
                  </span>
                )}
                {isChecks && totalWarnings === 0 && (
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#00C853]' : 'text-[#00C853]'
                    }`}
                  />
                )}
                {tab.tag && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#D32F2F]/10 text-[#D32F2F]'
                    }`}
                  >
                    {tab.tag}
                  </span>
                )}
                {!isChecks && !tab.tag && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive ? 'text-white/40' : 'text-[#888888]'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}

        {/* Quick Actions Header */}
        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#888888]">
          Data & Utilities
        </div>

        <div className="space-y-1">
          {/* Bulk CSV Import Button */}
          <button
            id="sidebar-btn-csv"
            onClick={() => {
              onOpenCsvImport();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-[#051C2C] hover:bg-[#F5F5F2] rounded-[6px] transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2251FF]" />
            <span>Bulk CSV Import</span>
          </button>

          {/* Export JSON Backup */}
          <button
            id="sidebar-btn-export"
            onClick={onExportBackup}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-[#051C2C] hover:bg-[#F5F5F2] rounded-[6px] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#051C2C]" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON Backup */}
          <button
            id="sidebar-btn-import"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-[#051C2C] hover:bg-[#F5F5F2] rounded-[6px] transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#051C2C]" />
            <span>Import Backup</span>
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
            id="sidebar-btn-reset"
            onClick={() => {
              onResetData();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-[#888888] hover:text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded-[6px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Baseline Seed</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer - Auto-save Status & Info */}
      <div className="p-4 border-t border-[#E8E8E6] bg-white text-[11px] text-[#888888] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#00C853]" />
            <span>Auto-saved:</span>
          </div>
          <span className="font-mono text-[#051C2C] font-semibold">{lastSavedFormatted}</span>
        </div>
        <div className="text-[10px] text-[#888888]/80 leading-tight">
          Client-side persistence in browser storage.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top App Bar (Visible on <lg screens only) */}
      <header
        id="mobile-top-bar"
        className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E8E8E6] shadow-sm px-4 h-14 flex items-center justify-between select-none no-print"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-sidebar-mobile-toggle"
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 -ml-1.5 rounded-md text-[#051C2C] hover:bg-[#F5F5F2] transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#051C2C] text-white flex items-center justify-center font-serif text-sm font-bold shadow-sm">
              £
            </div>
            <span className="font-heading font-bold text-[#051C2C] text-[15px]">
              Costing Engine
            </span>
          </div>
        </div>

        {/* Current Tab Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#2251FF] bg-[#2251FF]/10 px-2.5 py-1 rounded-full">
            {activeTabConfig.code} {activeTabConfig.label}
          </span>
          {totalWarnings > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D32F2F] text-white">
              {totalWarnings}
            </span>
          )}
        </div>
      </header>

      {/* Desktop Persistent Sidebar (Visible on lg+ screens) */}
      <aside
        id="desktop-sidebar"
        className="hidden lg:flex w-72 shrink-0 h-screen sticky top-0 flex-col bg-white border-r border-[#E8E8E6] z-30 no-print"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay (Animated slide-over for small screens) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex no-print">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#051C2C]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Container */}
          <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
