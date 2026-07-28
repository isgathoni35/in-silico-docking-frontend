'use client';

import React from 'react';
import { DockingPose } from '@/lib/types';

interface ScoreTableProps {
  poses: DockingPose[];
  selectedPoseMode?: number;
  onSelectPose: (pose: DockingPose) => void;
}

export const ScoreTable: React.FC<ScoreTableProps> = ({
  poses,
  selectedPoseMode,
  onSelectPose,
}) => {
  if (!poses || poses.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Docking Conformer Affinity Scores</h3>
          <p className="text-xs text-slate-400">AutoDock Vina predicted binding free energies (kcal/mol)</p>
        </div>
        <span className="px-2 py-1 text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
          {poses.length} Conformers Generated
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Mode</th>
              <th className="py-2.5 px-3">Affinity Score (kcal/mol)</th>
              <th className="py-2.5 px-3">RMSD lower bound</th>
              <th className="py-2.5 px-3">RMSD upper bound</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {poses.map((pose) => {
              const isSelected = selectedPoseMode === pose.mode;
              return (
                <tr
                  key={pose.mode}
                  className={`hover:bg-slate-800/40 transition cursor-pointer ${
                    isSelected ? 'bg-cyan-950/40 border-l-2 border-cyan-500' : ''
                  }`}
                  onClick={() => onSelectPose(pose)}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-200">#{pose.mode}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-semibold ${
                        pose.affinity_score <= -7.0
                          ? 'text-emerald-400'
                          : pose.affinity_score <= -5.0
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {pose.affinity_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{pose.rmsd_lb.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-slate-400">{pose.rmsd_ub.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded transition ${
                        isSelected
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isSelected ? 'Active Pose' : 'View Pose'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
