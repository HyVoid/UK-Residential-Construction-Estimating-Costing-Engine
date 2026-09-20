import React, { useState, useEffect, useMemo } from 'react';
import {
  WorkbookState,
  ActiveTab,
  TakeoffRow,
  ProjectSetup,
  MasterItem,
  ContractorRate,
  AdjustmentItem,
} from './types';
import { INITIAL_WORKBOOK_STATE } from './data/seedData';
import {
  calculateTakeoffRows,
  calculateInternalEstimate,
  calculateCustomerEstimate,
  calculateAuditChecks,
} from './utils/calculations';
import { Sidebar } from './components/Sidebar';
import { SetupView } from './components/SetupView';
import { ItemMasterView } from './components/ItemMasterView';
import { RateLibraryView } from './components/RateLibraryView';
import { ProjectEstimateView } from './components/ProjectEstimateView';
import { AdjustmentsView } from './components/AdjustmentsView';
import { InternalEstimateView } from './components/InternalEstimateView';
import { CustomerEstimateView } from './components/CustomerEstimateView';
import { ChecksView } from './components/ChecksView';
import { CsvImportModal } from './components/CsvImportModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

const STORAGE_KEY = 'uk_costing_engine_workbook_v2';

export default function App() {
  // Load state from localStorage or initialize with seed data
  const [state, setState] = useState<WorkbookState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.setup && Array.isArray(parsed.itemMaster)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load workbook from localStorage, falling back to seed data.', e);
    }
    return INITIAL_WORKBOOK_STATE;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('04_Project_Estimate');
  const [lastSavedFormatted, setLastSavedFormatted] = useState<string>('Just now');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Auto-save to localStorage on every state change
  useEffect(() => {
    try {
      const stateToSave: WorkbookState = {
        ...state,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

      const now = new Date();
      setLastSavedFormatted(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    } catch (e) {
      console.error('Error auto-saving workbook state:', e);
    }
  }, [state]);

  // Real-time calculation pipeline
  const calculatedTakeoff = useMemo(() => calculateTakeoffRows(state), [state]);

  const internalTotals = useMemo(
    () => calculateInternalEstimate(state, calculatedTakeoff),
    [state, calculatedTakeoff]
  );

  const customerTotals = useMemo(
    () => calculateCustomerEstimate(state, calculatedTakeoff, internalTotals),
    [state, calculatedTakeoff, internalTotals]
  );

  const auditResult = useMemo(
    () => calculateAuditChecks(state, calculatedTakeoff, internalTotals, customerTotals),
    [state, calculatedTakeoff, internalTotals, customerTotals]
  );

  // Handlers for updating state modules
  const handleUpdateSetup = (updated: Partial<ProjectSetup>) => {
    setState((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        ...updated,
      },
    }));
  };

  // Master Items handlers
  const handleUpdateMasterItem = (id: string, updated: Partial<MasterItem>) => {
    setState((prev) => ({
      ...prev,
      itemMaster: prev.itemMaster.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    }));
  };

  const handleAddMasterItem = (item: MasterItem) => {
    setState((prev) => ({
      ...prev,
      itemMaster: [...prev.itemMaster, item],
    }));
  };

  const handleDeleteMasterItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      itemMaster: prev.itemMaster.filter((i) => i.id !== id),
    }));
  };

  // Rate Library handlers
  const handleUpdateRate = (id: string, updated: Partial<ContractorRate>) => {
    setState((prev) => ({
      ...prev,
      rateLibrary: prev.rateLibrary.map((r) => (r.id === id ? { ...r, ...updated } : r)),
    }));
  };

  const handleAddRate = (rate: ContractorRate) => {
    setState((prev) => ({
      ...prev,
      rateLibrary: [...prev.rateLibrary, rate],
    }));
  };

  const handleDeleteRate = (id: string) => {
    setState((prev) => ({
      ...prev,
      rateLibrary: prev.rateLibrary.filter((r) => r.id !== id),
    }));
  };

  const handleSelectContractor = (contractor: string) => {
    handleUpdateSetup({ selectedContractor: contractor });
  };

  // Takeoff rows handlers
  const handleUpdateTakeoffRow = (id: string, updated: Partial<TakeoffRow>) => {
    setState((prev) => ({
      ...prev,
      projectEstimate: prev.projectEstimate.map((row) =>
        row.id === id ? { ...row, ...updated } : row
      ),
    }));
  };

  const handleAddTakeoffRow = (newRow?: Partial<TakeoffRow>) => {
    const defaultMaster = state.itemMaster[0]?.masterItemCode || 'GW-001';
    const row: TakeoffRow = {
      id: `te-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      takeoffItemCode: defaultMaster,
      measuredQuantity: 10,
      locationRef: 'Ground Floor Area',
      wasteOverridePct: null,
      rateOverrideValue: null,
      ...newRow,
    };

    setState((prev) => ({
      ...prev,
      projectEstimate: [...prev.projectEstimate, row],
    }));
  };

  const handleDeleteTakeoffRow = (id: string) => {
    setState((prev) => ({
      ...prev,
      projectEstimate: prev.projectEstimate.filter((r) => r.id !== id),
    }));
  };

  // Adjustments handlers
  const handleUpdateAdjustment = (id: string, updated: Partial<AdjustmentItem>) => {
    setState((prev) => ({
      ...prev,
      adjustments: prev.adjustments.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
  };

  const handleAddAdjustment = (item: AdjustmentItem) => {
    setState((prev) => ({
      ...prev,
      adjustments: [...prev.adjustments, item],
    }));
  };

  const handleDeleteAdjustment = (id: string) => {
    setState((prev) => ({
      ...prev,
      adjustments: prev.adjustments.filter((a) => a.id !== id),
    }));
  };

  // Bulk CSV Import
  const handleImportTakeoffCsv = (rows: TakeoffRow[], replace: boolean) => {
    setState((prev) => ({
      ...prev,
      projectEstimate: replace ? rows : [...prev.projectEstimate, ...rows],
    }));
    setActiveTab('04_Project_Estimate');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `UK_Costing_Engine_Backup_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportBackup = (imported: WorkbookState) => {
    setState(imported);
    alert('Workbook successfully restored from backup.');
  };

  // Reset to seed data
  const handleConfirmReset = () => {
    setState({
      ...INITIAL_WORKBOOK_STATE,
      lastSaved: new Date().toISOString(),
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F2] text-[#1A1A2E]">
      {/* Responsive Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        state={state}
        auditResult={auditResult}
        lastSavedFormatted={lastSavedFormatted}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onOpenCsvImport={() => setIsCsvModalOpen(true)}
        onResetData={() => setIsResetModalOpen(true)}
      />

      {/* Main Content & Footer Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
        {activeTab === '01_Setup' && (
          <SetupView
            setup={state.setup}
            rateLibrary={state.rateLibrary}
            onUpdateSetup={handleUpdateSetup}
          />
        )}

        {activeTab === '02_Item_Master' && (
          <ItemMasterView
            itemMaster={state.itemMaster}
            onUpdateItem={handleUpdateMasterItem}
            onAddItem={handleAddMasterItem}
            onDeleteItem={handleDeleteMasterItem}
          />
        )}

        {activeTab === '03_Rate_Library' && (
          <RateLibraryView
            rateLibrary={state.rateLibrary}
            itemMaster={state.itemMaster}
            currencySymbol={state.setup.currencySymbol}
            selectedContractor={state.setup.selectedContractor}
            onUpdateRate={handleUpdateRate}
            onAddRate={handleAddRate}
            onDeleteRate={handleDeleteRate}
            onSelectContractor={handleSelectContractor}
          />
        )}

        {activeTab === '04_Project_Estimate' && (
          <ProjectEstimateView
            calculatedRows={calculatedTakeoff}
            itemMaster={state.itemMaster}
            setup={state.setup}
            onUpdateRow={handleUpdateTakeoffRow}
            onAddRow={handleAddTakeoffRow}
            onDeleteRow={handleDeleteTakeoffRow}
            onOpenCsvImport={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === '05_Adjustments' && (
          <AdjustmentsView
            adjustments={state.adjustments}
            currencySymbol={state.setup.currencySymbol}
            prelimsMode={state.setup.prelimsMode}
            onUpdateAdjustment={handleUpdateAdjustment}
            onAddAdjustment={handleAddAdjustment}
            onDeleteAdjustment={handleDeleteAdjustment}
          />
        )}

        {activeTab === '06_Internal_Estimate' && (
          <InternalEstimateView totals={internalTotals} setup={state.setup} />
        )}

        {activeTab === '07_Customer_Estimate' && (
          <CustomerEstimateView customerTotals={customerTotals} setup={state.setup} />
        )}

        {activeTab === '08_Checks' && (
          <ChecksView
            auditResult={auditResult}
            currencySymbol={state.setup.currencySymbol}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Page Footer & Privacy Note (Required English disclaimer) */}
      <footer className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 py-6 border-t border-[#E8E8E6] text-center no-print">
        <p className="text-[12px] text-[#888888] leading-relaxed max-w-2xl mx-auto">
          All storage functions of this tool are retained in your browser's localStorage. The application does not store or transmit any user data to external servers.
        </p>
        <div className="text-[11px] text-[#888888]/70 mt-1">
          UK Residential Costing Engine • Standardized RICS & JCT Minor Works Pricing Framework
        </div>
      </footer>
      </div>

      {/* Bulk CSV Import Modal */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportTakeoff={handleImportTakeoffCsv}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
