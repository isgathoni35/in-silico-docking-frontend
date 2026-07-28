'use client';

import React from 'react';
import { AIInsightReport } from '@/lib/types';

interface InsightReportCardProps {
  report?: AIInsightReport;
  loading?: boolean;
}

export const InsightReportCard: React.FC<InsightReportCardProps> = ({ report, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-slate-800"></div>
          <div className="h-4 w-48 bg-slate-800 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-800 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Gemini AI Active Site & Docking Report</h3>
            <p className="text-xs text-slate-400">Automated chemical summary & bioactivity evaluation</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
          report.validity_rating === 'High'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          Validity: {report.validity_rating}
        </span>
      </div>

      <div className="space-y-3 text-xs text-slate-300">
        <div>
          <h4 className="font-semibold text-purple-300 text-xs mb-1">Executive Summary</h4>
          <p className="leading-relaxed text-slate-300">{report.summary}</p>
        </div>

        <div>
          <h4 className="font-semibold text-purple-300 text-xs mb-1">Binding Free Energy Interpretation</h4>
          <p className="leading-relaxed text-slate-400">{report.binding_affinity_evaluation}</p>
        </div>

        {report.key_interactions && report.key_interactions.length > 0 && (
          <div>
            <h4 className="font-semibold text-purple-300 text-xs mb-1">Predicted Key Interactions</h4>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 font-mono">
              {report.key_interactions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
