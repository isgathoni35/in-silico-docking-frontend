'use client';

import React, { useState } from 'react';
import { LigandMetadata } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

interface LigandFormProps {
  onLigandPrepared: (ligand: LigandMetadata) => void;
}

const PRESET_LIGANDS = [
  { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { name: 'Curcumin', smiles: 'O=C(\C=C\c1ccc(O)c(OC)c1)CC(=O)/C=C/c2ccc(O)c(OC)c2' },
  { name: 'Quercetin', smiles: 'O=C1C(O)=C(c2ccc(O)c(O)c2)OC3=CC(O)=CC(O)=C13' },
  { name: 'Ibuprofen', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O' },
];

export const LigandForm: React.FC<LigandFormProps> = ({ onLigandPrepared }) => {
  const [smiles, setSmiles] = useState<string>('CC(=O)OC1=CC=CC=C1C(=O)O');
  const [name, setName] = useState<string>('Aspirin');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrepare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smiles.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const ligand = await apiClient.prepareLigand(smiles.trim(), name.trim() || 'Custom Ligand');
      onLigandPrepared(ligand);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate 3D conformer & PDBQT with RDKit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.6 1.601a2 2 0 00.586 3.414l2.428.809a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.022-.547l1.6-1.6a2 2 0 00-.586-3.415l-2.428-.809z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">2. Ligand SMILES Input</h3>
          <p className="text-xs text-slate-400">RDKit 3D Conformer & Gasteiger Charges</p>
        </div>
      </div>

      <form onSubmit={handlePrepare} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Ligand Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Curcumin"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition mb-3"
          />

          <label className="block text-xs font-medium text-slate-400 mb-1">SMILES String</label>
          <textarea
            value={smiles}
            onChange={(e) => setSmiles(e.target.value)}
            rows={2}
            placeholder="Input valid SMILES..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Quick presets */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Preset Molecules:</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_LIGANDS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setName(preset.name);
                  setSmiles(preset.smiles);
                }}
                className="px-2 py-1 text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded border border-slate-800 transition"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !smiles.trim()}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20"
        >
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : 'Prepare 3D Conformer'}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
