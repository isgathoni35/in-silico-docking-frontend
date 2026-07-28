'use client';

import React, { useState } from 'react';
import { Vector3D } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

interface GridBoxControlsProps {
  pdbId?: string;
  gridCenter: Vector3D;
  gridSize: Vector3D;
  onChangeCenter: (center: Vector3D) => void;
  onChangeSize: (size: Vector3D) => void;
}

export const GridBoxControls: React.FC<GridBoxControlsProps> = ({
  pdbId,
  gridCenter,
  gridSize,
  onChangeCenter,
  onChangeSize,
}) => {
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  const handleAiAutoDetect = async () => {
    if (!pdbId) return;

    try {
      setAiLoading(true);
      const res = await apiClient.getAIActiveSite(pdbId);
      onChangeCenter(res.recommended_grid_center);
      onChangeSize(res.recommended_grid_size);
      setAiReasoning(res.reasoning);
    } catch (err) {
      console.error("AI active site detection failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">3. Active Site Grid Box</h3>
            <p className="text-xs text-slate-400">Set AutoDock Vina (X, Y, Z) search space</p>
          </div>
        </div>

        {pdbId && (
          <button
            onClick={handleAiAutoDetect}
            disabled={aiLoading}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[11px] font-medium rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            {aiLoading ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-3.5 h-3.5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            AI Active Site
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Center Controls */}
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-2">Grid Center (X, Y, Z)</span>
          <div className="grid grid-cols-3 gap-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={`center-${axis}`}>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">{axis}</label>
                <input
                  type="number"
                  step="0.1"
                  value={gridCenter[axis]}
                  onChange={(e) => onChangeCenter({ ...gridCenter, [axis]: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Size Controls */}
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-2">Grid Dimensions (Å)</span>
          <div className="grid grid-cols-3 gap-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={`size-${axis}`}>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">size_{axis}</label>
                <input
                  type="number"
                  step="1"
                  min="5"
                  max="50"
                  value={gridSize[axis]}
                  onChange={(e) => onChangeSize({ ...gridSize, [axis]: parseFloat(e.target.value) || 20 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {aiReasoning && (
        <div className="mt-3 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300">
          <span className="font-semibold text-indigo-200 block mb-0.5">AI Literature Insight:</span>
          {aiReasoning}
        </div>
      )}
    </div>
  );
};
