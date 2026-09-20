import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051C2C]/50 backdrop-blur-sm">
      <div className="cost-card w-full max-w-md bg-white p-6 space-y-4 shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E6]">
          <div className="flex items-center gap-2 font-heading text-[18px] font-bold text-[#D32F2F]">
            <AlertTriangle className="w-5 h-5 text-[#D32F2F]" />
            Reset Workbook to Baseline Data
          </div>
          <button onClick={onClose} className="text-[#888888] hover:text-[#051C2C] p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[13px] text-[#051C2C]">
          Are you sure you want to reset all workbook sheets to the original seed data? This will overwrite
          all custom takeoff measurements, adjustments, parameters, and contractor rates in your local storage.
        </p>

        <p className="text-[12px] text-[#888888]">
          Tip: You can use <strong>Export Backup</strong> to save your current work before resetting.
        </p>

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
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#D32F2F] text-white rounded-[6px] text-[12px] font-semibold hover:bg-[#D32F2F]/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
