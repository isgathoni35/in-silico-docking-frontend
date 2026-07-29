'use client';

import React from 'react';
import { DockingPose } from '@/lib/types';

interface FileExporterPanelProps {
  receptorPdbqt?: string;
  ligandPdbqt?: string;
  poses?: DockingPose[];
  rawLog?: string;
  pdbId?: string;
  ligandName?: string;
}

export const FileExporterPanel: React.FC<FileExporterPanelProps> = ({
  receptorPdbqt,
  ligandPdbqt,
  poses,
  rawLog,
  pdbId = 'protein',
  ligandName = 'ligand',
}) => {
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePosesPdbqt = (): string => {
    if (!poses || poses.length === 0) return '';
    return poses.map(p => p.pdbqt_content).join('\n');
  };

  if (!receptorPdbqt && !ligandPdbqt && (!poses || poses.length === 0)) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Scientific File Exporters</h4>
            <p className="text-[11px] text-slate-400">Download intermediate PDBQT files and logs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {receptorPdbqt && (
          <button
            type="button"
            onClick={() => downloadFile(receptorPdbqt, `${pdbId}_receptor.pdbqt`)}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono rounded border border-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <span>📄</span> receptor.pdbqt
          </button>
        )}

        {ligandPdbqt && (
          <button
            type="button"
            onClick={() => downloadFile(ligandPdbqt, `${ligandName}_prepared.pdbqt`)}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono rounded border border-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <span>📄</span> ligand.pdbqt
          </button>
        )}

        {poses && poses.length > 0 && (
          <button
            type="button"
            onClick={() => downloadFile(generatePosesPdbqt(), `${pdbId}_${ligandName}_docked_poses.pdbqt`)}
            className="px-3 py-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-mono rounded border border-emerald-500/30 transition flex items-center justify-center gap-1.5"
          >
            <span>📄</span> docked_poses.pdbqt
          </button>
        )}

        {rawLog && (
          <button
            type="button"
            onClick={() => downloadFile(rawLog, `vina_execution.log`)}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono rounded border border-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <span>📝</span> vina.log
          </button>
        )}
      </div>
    </div>
  );
};
