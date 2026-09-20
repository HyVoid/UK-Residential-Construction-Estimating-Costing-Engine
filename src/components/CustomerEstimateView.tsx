import React from 'react';
import { CustomerEstimateTotals, ProjectSetup } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Printer, CheckCircle, ShieldCheck, Building, Calendar, FileText } from 'lucide-react';

interface CustomerEstimateViewProps {
  customerTotals: CustomerEstimateTotals;
  setup: ProjectSetup;
}

export const CustomerEstimateView: React.FC<CustomerEstimateViewProps> = ({
  customerTotals,
  setup,
}) => {
  const {
    sections,
    worksNetTotal,
    provisionalSumsTotal,
    totalNetEstimate,
    vatAmount,
    totalGrossQuotation,
  } = customerTotals;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8E6]">
        <div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#051C2C] tracking-tight">
            07_Customer_Estimate: Official Client Quotation
          </h1>
          <p className="text-[13px] text-[#888888]">
            External tender schedule. Commercial margins and site preliminaries are smoothly amortized into composite item rates. Ready for client issuance or PDF export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-quote"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#051C2C] hover:bg-[#051C2C]/90 text-white rounded-[6px] text-[12px] font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#2251FF]" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Document Container */}
      <div className="cost-card p-6 sm:p-10 bg-white max-w-[1200px] mx-auto space-y-8">
        {/* Document Header / Company & Client Info */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-[#051C2C]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#051C2C] text-white flex items-center justify-center font-serif text-base font-bold">
                £
              </div>
              <span className="font-heading text-[20px] font-bold text-[#051C2C] tracking-tight">
                Apex Chartered Quantity Surveyors & Builders
              </span>
            </div>
            <p className="text-[12px] text-[#888888]">
              Royal Institution of Chartered Surveyors (RICS) Compliant Estimating
            </p>
            <p className="text-[12px] text-[#888888]">
              St Albans, Hertfordshire, AL1 • tender@apex-costing.co.uk
            </p>
          </div>

          <div className="text-right space-y-1 sm:min-w-[240px]">
            <div className="font-display text-[20px] font-bold text-[#051C2C]">
              OFFICIAL TENDER QUOTATION
            </div>
            <div className="text-[12px] text-[#051C2C] font-mono">
              Ref: <strong className="text-[#2251FF]">{setup.projectVersion}</strong>
            </div>
            <div className="text-[12px] text-[#888888] flex items-center justify-end gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date: {setup.estimateDate}</span>
            </div>
          </div>
        </div>

        {/* Project & Client Details Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-[8px] bg-[#F5F5F2] text-[13px]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] block mb-0.5">
              Employer / Client:
            </span>
            <div className="font-bold text-[#051C2C] text-[15px]">{setup.clientName}</div>
            <div className="text-[#051C2C]">{setup.location}</div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] block mb-0.5">
              Project Description:
            </span>
            <div className="font-bold text-[#051C2C]">{setup.projectName}</div>
            <div className="text-[#888888] text-[12px]">{setup.projectType} • Approx {setup.grossFloorAreaSqm} m² GFA</div>
          </div>
        </div>

        {/* Work Breakdown Section Tables */}
        <div className="space-y-6">
          {sections.map((sec, secIdx) => (
            <div key={sec.sectionName} className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#051C2C]/20">
                <h3 className="font-heading font-bold text-[#051C2C] text-[15px] tracking-tight">
                  Section {secIdx + 1}: {sec.sectionName}
                </h3>
                <span className="font-mono font-bold text-[#051C2C] text-[13px]">
                  Subtotal: {formatCurrency(sec.sectionSubtotal, setup.currencySymbol)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-[#051C2C]/[0.03] text-[#051C2C]">
                      <th className="px-3 py-2 font-semibold uppercase tracking-wider w-12 text-center">Item</th>
                      <th className="px-3 py-2 font-semibold uppercase tracking-wider">Detailed Specification</th>
                      <th className="px-3 py-2 font-semibold uppercase tracking-wider w-16 text-center">Unit</th>
                      <th className="px-3 py-2 font-semibold uppercase tracking-wider w-24 text-right">Quantity</th>
                      <th className="px-3 py-2 font-semibold uppercase tracking-wider w-28 text-right">Rate</th>
                      <th className="px-4 py-2 font-semibold uppercase tracking-wider w-32 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8E6]">
                    {sec.items.map((item, itemIdx) => (
                      <tr key={item.id} className="hover:bg-[#051C2C]/[0.01]">
                        <td className="px-3 py-2 text-center text-[#888888] font-mono">
                          {secIdx + 1}.{itemIdx + 1}
                        </td>
                        <td className="px-3 py-2 text-[#051C2C] font-medium">
                          {item.itemDescription}
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-[#051C2C]">
                          {item.unit}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-[#051C2C]">
                          {item.quantity.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-[#051C2C]">
                          {formatCurrency(item.customerUnitRateBlended, setup.currencySymbol)}
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-[#051C2C]">
                          {formatCurrency(item.customerLineTotal, setup.currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="py-12 text-center text-[#888888]">
              No takeoff items mapped. Complete Sheet 04 first.
            </div>
          )}
        </div>

        {/* Commercial Summary Settlement Table */}
        <div className="flex flex-col sm:flex-row justify-end pt-4 border-t-2 border-[#051C2C]">
          <div className="w-full sm:w-80 space-y-2.5 text-[13px]">
            <div className="flex justify-between py-1 border-b border-[#E8E8E6]">
              <span className="text-[#888888]">Measured Works Net Total:</span>
              <span className="font-mono font-medium text-[#051C2C]">
                {formatCurrency(worksNetTotal, setup.currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#E8E8E6]">
              <span className="text-[#888888]">Defined Provisional Sums:</span>
              <span className="font-mono font-medium text-[#051C2C]">
                {formatCurrency(provisionalSumsTotal, setup.currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between py-1.5 font-bold text-[#051C2C] text-[14px]">
              <span>Total Net Estimate (Excl. VAT):</span>
              <span className="font-mono text-[15px]">
                {formatCurrency(totalNetEstimate, setup.currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between py-1 text-[#888888] border-b border-[#E8E8E6]">
              <span>UK VAT ({setup.vatRate * 100}%):</span>
              <span className="font-mono font-medium text-[#051C2C]">
                {formatCurrency(vatAmount, setup.currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between p-3 rounded-[6px] bg-[#051C2C] text-white font-bold text-[16px]">
              <span className="font-heading">TOTAL GROSS QUOTATION:</span>
              <span className="font-mono text-[#00C853] text-[18px]">
                {formatCurrency(totalGrossQuotation, setup.currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Signature & Formal Acceptance Box */}
        <div className="pt-8 border-t border-[#E8E8E6] grid grid-cols-1 md:grid-cols-2 gap-8 text-[12px]">
          <div className="p-4 rounded-[6px] border border-[#E8E8E6] space-y-4">
            <div className="font-bold text-[#051C2C] uppercase tracking-wider">
              Issued By Contractor / Quantity Surveyor
            </div>
            <p className="text-[#888888]">
              I confirm this quotation reflects the current drawings, statutory building regulations, and agreed provisional sums.
            </p>
            <div className="pt-6 border-b border-[#051C2C]/30 flex justify-between items-end">
              <span className="text-[11px] text-[#888888]">Authorised Signature:</span>
              <span className="font-serif italic text-[14px] text-[#051C2C]">{setup.estimatorName}</span>
            </div>
            <div className="text-[11px] text-[#888888]">Date: {setup.estimateDate}</div>
          </div>

          <div className="p-4 rounded-[6px] border border-[#E8E8E6] space-y-4">
            <div className="font-bold text-[#051C2C] uppercase tracking-wider">
              Employer / Client Formal Acceptance
            </div>
            <p className="text-[#888888]">
              I/We accept the terms of this quotation and instruct the works in accordance with the specified schedule.
            </p>
            <div className="pt-6 border-b border-[#051C2C]/30 flex justify-between items-end">
              <span className="text-[11px] text-[#888888]">Client Signature:</span>
              <span className="font-serif italic text-[14px] text-[#888888]">___________________</span>
            </div>
            <div className="text-[11px] text-[#888888]">Date: ___________________</div>
          </div>
        </div>
      </div>
    </div>
  );
};
