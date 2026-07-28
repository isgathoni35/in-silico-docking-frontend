'use client';

import React, { useState } from 'react';
import { ProteinMetadata } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

interface ProteinFormProps {
  onProteinLoaded: (protein: ProteinMetadata) => void;
}

export const ProteinForm: React.FC<ProteinFormProps> = ({ onProteinLoaded }) => {
  const [pdbId, setPdbId] = useState<string>('1CAG');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdbId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const protein = await apiClient.fetchProtein(pdbId.trim().toUpperCase());
      onProteinLoaded(protein);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch PDB file from RCSB database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.6 1.601a2 2 0 00.586 3.414l2.428.809a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.022-.547l1.6-1.6a2 2 0 00-.586-3.415l-2.428-.809z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">1. Target Protein Selection</h3>
          <p className="text-xs text-slate-400">Enter RCSB PDB ID to fetch macromolecule</p>
        </div>
      </div>

      <form onSubmit={handleFetch} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">RCSB PDB ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pdbId}
              onChange={(e) => setPdbId(e.target.value.toUpperCase())}
              placeholder="e.g. 1CAG, 6LU7, 1HSG"
              maxLength={6}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 uppercase transition"
            />
            <button
              type="submit"
              disabled={loading || !pdbId.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex items-center gap-2 shadow-md shadow-cyan-900/20"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Fetch PDB'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
