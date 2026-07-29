'use client';

import React, { useState } from 'react';

interface AdvancedSettingsAccordionProps {
  exhaustiveness: number;
  energyRange: number;
  numModes: number;
  forcefield: string;
  onChangeExhaustiveness: (val: number) => void;
  onChangeEnergyRange: (val: number) => void;
  onChangeNumModes: (val: number) => void;
  onChangeForcefield: (val: string) => void;
}

export const AdvancedSettingsAccordion: React.FC<AdvancedSettingsAccordionProps> = ({
  exhaustiveness,
  energyRange,
  numModes,
  forcefield,
  onChangeExhaustiveness,
  onChangeEnergyRange,
  onChangeNumModes,
  onChangeForcefield,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Advanced Scientific Parameters</h4>
            <p className="text-[11px] text-slate-400">Tune Vina exhaustiveness, energy cutoffs & forcefield</p>
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800/80 space-y-4 bg-slate-950/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exhaustiveness Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Vina Exhaustiveness</label>
                <span className="text-xs font-mono font-bold text-cyan-400">{exhaustiveness}</span>
              </div>
              <input
                type="range"
                min="1"
                max="32"
                value={exhaustiveness}
                onChange={(e) => onChangeExhaustiveness(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">1 = Fast Screening, 32 = High Precision Research</span>
            </div>

            {/* Energy Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Energy Range Cutoff (kcal/mol)</label>
                <span className="text-xs font-mono font-bold text-cyan-400">{energyRange.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={energyRange}
                onChange={(e) => onChangeEnergyRange(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Max energy difference from top pose</span>
            </div>

            {/* Num Modes Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Maximum Conformer Poses</label>
                <span className="text-xs font-mono font-bold text-cyan-400">{numModes}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={numModes}
                onChange={(e) => onChangeNumModes(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Number of binding modes to output</span>
            </div>

            {/* Forcefield Selection */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">RDKit 3D Forcefield</label>
              <select
                value={forcefield}
                onChange={(e) => onChangeForcefield(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="MMFF94">MMFF94 (Merck Molecular Force Field)</option>
                <option value="UFF">UFF (Universal Force Field)</option>
              </select>
              <span className="text-[10px] text-slate-500 block mt-1">Geometry minimization algorithm</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
