'use client';

import React, { useState } from 'react';

interface TerminalConsoleLogProps {
  vinaCmd?: string;
  rawLog?: string;
}

export const TerminalConsoleLog: React.FC<TerminalConsoleLogProps> = ({ vinaCmd, rawLog }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!rawLog && !vinaCmd) return null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-900/90 hover:bg-slate-850 transition flex items-center justify-between text-left border-b border-slate-800/60"
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs text-slate-300 font-semibold font-mono">Terminal Output & Vina CLI Log</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-cyan-400 font-sans font-medium px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/20 rounded">
            {isOpen ? 'Hide Console' : 'Show Console'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="p-4 bg-slate-950 text-xs text-emerald-400 font-mono space-y-3 max-h-80 overflow-y-auto">
          {vinaCmd && (
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">$ Executed Command:</span>
              <div className="p-2 bg-slate-900/90 border border-slate-800 rounded text-slate-200 select-all font-mono text-[11px] overflow-x-auto">
                {vinaCmd}
              </div>
            </div>
          )}

          {rawLog && (
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">$ AutoDock Vina Execution Log Output:</span>
              <pre className="p-3 bg-slate-900/60 border border-slate-800/80 rounded text-emerald-400 whitespace-pre-wrap text-[11px] leading-relaxed select-all">
                {rawLog}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
