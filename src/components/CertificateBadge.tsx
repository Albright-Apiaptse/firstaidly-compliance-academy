import React from "react";
import { Award, Calendar, CheckCircle, Download, ShieldCheck, User } from "lucide-react";
import { Certificate } from "../types";

interface CertificateBadgeProps {
  certificate: Certificate;
  onClose?: () => void;
}

export default function CertificateBadge({ certificate, onClose }: CertificateBadgeProps) {
  const issueDateStr = new Date(certificate.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expiryDateStr = new Date(certificate.expiryDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    expiring: "bg-amber-50 text-amber-700 border-amber-200",
    expired: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const statusLabels = {
    active: "Active & Compliant",
    expiring: "Expiring Soon",
    expired: "Expired / Non-Compliant",
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg text-left relative overflow-hidden">
      {/* Decorative certificate border elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-full blur-xl"></div>

      <div className="flex justify-between items-start mb-4">
        <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${statusColors[certificate.status]}`}>
          {statusLabels[certificate.status]}
        </span>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs font-medium">
            Close
          </button>
        )}
      </div>

      <div className="border-2 border-dashed border-amber-500/20 rounded-xl p-5 bg-amber-50/10 relative">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 mb-2">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-mono tracking-widest text-amber-700 uppercase">firstaid.ly Training Certificate</h3>
          <p className="text-xs text-slate-500 mt-1">firstaid.ly Compliance & Certification</p>
        </div>

        <div className="space-y-3.5 my-4">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Certified Responder</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-rose-500" />
              {certificate.studentName}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Discipline & Mastery</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {certificate.courseTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Issue Date</span>
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                {issueDateStr}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Expiration Date</span>
              <span className={`text-xs font-medium flex items-center gap-1.5 mt-0.5 ${certificate.status === 'expired' ? 'text-rose-600' : certificate.status === 'expiring' ? 'text-amber-600' : 'text-slate-700'}`}>
                <Calendar className="w-3 h-3" />
                {expiryDateStr}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code and Credentials Identifier */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
          <div>
            <span className="text-[8px] text-slate-400 block uppercase font-mono">Credential ID</span>
            <span className="text-[9px] font-mono text-slate-550">{certificate.id}</span>
          </div>
          <div className="w-10 h-10 bg-white border border-slate-200 p-0.5 rounded flex items-center justify-center">
            {/* Simple CSS simulated QR block */}
            <div className="grid grid-cols-4 gap-0.5 w-full h-full">
              <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
              <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div>
              <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
              <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 mt-4">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg transition"
        >
          <Download className="w-3.5 h-3.5" />
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
