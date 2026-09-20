import React, { useState } from 'react';
import { TakeoffRow, ContractorRate, MasterItem } from '../types';
import { Upload, FileSpreadsheet, X, Check, Copy } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTakeoff: (rows: TakeoffRow[], replace: boolean) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportTakeoff,
}) => {
  const [csvText, setCsvText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  if (!isOpen) return null;

  const sampleCsv = `takeoffItemCode,measuredQuantity,locationRef,wasteOverridePct,rateOverrideValue
GW-001,35.5,Rear Extension Foundations,,
GW-002,22.0,Mass Concrete Strip,,
MAS-001,75.0,External Facing Brickwork,0.08,
CAR-001,140.0,Dormer Pitched Rafters,,
PLA-001,310.0,Plasterboard Skim to all rooms,,
FIN-001,80.0,Engineered Oak Flooring,,`;

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleCsv);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText((event.target?.result as string) || '');
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    if (!csvText.trim()) {
      alert('Please enter or upload CSV data.');
      return;
    }

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      alert('CSV must contain a header row and at least one data row.');
      return;
    }

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const codeIdx = header.findIndex((h) => h.includes('code') || h.includes('item'));
    const qtyIdx = header.findIndex((h) => h.includes('quant') || h.includes('qty'));
    const locIdx = header.findIndex((h) => h.includes('loc') || h.includes('ref'));
    const wasteIdx = header.findIndex((h) => h.includes('waste'));
    const overrideIdx = header.findIndex((h) => h.includes('override') || h.includes('rate'));

    if (codeIdx === -1 || qtyIdx === -1) {
      alert('CSV must contain at least "takeoffItemCode" and "measuredQuantity" columns.');
      return;
    }

    const parsedRows: TakeoffRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

      const code = cols[codeIdx]?.toUpperCase();
      const qty = parseFloat(cols[qtyIdx]) || 0;
      const location = locIdx !== -1 ? cols[locIdx] || 'Imported via CSV' : 'Imported via CSV';
      const waste = wasteIdx !== -1 && cols[wasteIdx] ? parseFloat(cols[wasteIdx]) : null;
      const rateOverride =
        overrideIdx !== -1 && cols[overrideIdx] ? parseFloat(cols[overrideIdx]) : null;

      if (code) {
        parsedRows.push({
          id: `te-csv-${Date.now()}-${i}`,
          takeoffItemCode: code,
          measuredQuantity: qty,
          locationRef: location,
          wasteOverridePct: waste,
          rateOverrideValue: rateOverride,
        });
      }
    }

    if (parsedRows.length === 0) {
      alert('No valid takeoff rows could be extracted from the CSV.');
      return;
    }

    onImportTakeoff(parsedRows, replaceExisting);
    onClose();
    setCsvText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051C2C]/50 backdrop-blur-sm">
      <div className="cost-card w-full max-w-2xl bg-white p-6 space-y-4 shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E6]">
          <div className="flex items-center gap-2 font-heading text-[18px] font-bold text-[#051C2C]">
            <FileSpreadsheet className="w-5 h-5 text-[#2251FF]" />
            Bulk CSV Takeoff Importer
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#051C2C] p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[12px] text-[#888888]">
          Paste or upload CSV engineering takeoff data. Columns are matched automatically by header name.
        </p>

        {/* Sample Snippet */}
        <div className="p-3 bg-[#F5F5F2] rounded-[6px] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">
            <span>Expected CSV Header Schema:</span>
            <button
              onClick={handleCopySample}
              className="text-[#2251FF] hover:underline flex items-center gap-1 font-normal lowercase"
            >
              <Copy className="w-3 h-3" />
              {copiedSample ? 'Copied to clipboard!' : 'Copy sample template'}
            </button>
          </div>
          <pre className="text-[11px] font-mono text-[#051C2C] bg-white p-2 rounded border border-[#E8E8E6] overflow-x-auto">
            {sampleCsv}
          </pre>
        </div>

        {/* Textarea Input */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-[#051C2C] mb-1">
            Paste CSV Data or Drag & Drop file:
          </label>
          <textarea
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="takeoffItemCode,measuredQuantity,locationRef..."
            className="cell-editable w-full p-2.5 font-mono text-[12px]"
          />
        </div>

        {/* Upload File Input & Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#2251FF] font-medium hover:underline">
            <Upload className="w-4 h-4" />
            <span>Upload .csv file from computer</span>
            <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <label className="flex items-center gap-2 text-[12px] text-[#051C2C] select-none cursor-pointer">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="rounded border-[#E8E8E6] text-[#2251FF] focus:ring-[#2251FF]"
            />
            <span>Replace all existing takeoff rows (instead of appending)</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E8E6]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[12px] text-[#888888] hover:text-[#051C2C]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProcessImport}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2251FF] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#2251FF]/90 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Parse & Import Takeoff</span>
          </button>
        </div>
      </div>
    </div>
  );
};
