'use client';

import React, { useState } from 'react';
import { ProteinViewer } from '@/components/3d/ProteinViewer';
import { Mol3DErrorBoundary } from '@/components/3d/3DmolErrorBoundary';
import { ProteinForm } from '@/components/docking/ProteinForm';
import { LigandForm } from '@/components/docking/LigandForm';
import { GridBoxControls } from '@/components/docking/GridBoxControls';
import { AdvancedSettingsAccordion } from '@/components/docking/AdvancedSettingsAccordion';
import { ScoreTable } from '@/components/docking/ScoreTable';
import { FileExporterPanel } from '@/components/docking/FileExporterPanel';
import { TerminalConsoleLog } from '@/components/docking/TerminalConsoleLog';
import { InsightReportCard } from '@/components/ai/InsightReportCard';
import { ProteinMetadata, LigandMetadata, Vector3D, DockingPose, AIInsightReport } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

export default function DockingDashboard() {
  const [protein, setProtein] = useState<ProteinMetadata | null>(null);
  const [ligand, setLigand] = useState<LigandMetadata | null>(null);

  const [gridCenter, setGridCenter] = useState<Vector3D>({ x: 0, y: 0, z: 0 });
  const [gridSize, setGridSize] = useState<Vector3D>({ x: 20, y: 20, z: 20 });

  // Advanced Vina parameters state
  const [exhaustiveness, setExhaustiveness] = useState<number>(8);
  const [energyRange, setEnergyRange] = useState<number>(3.0);
  const [numModes, setNumModes] = useState<number>(9);
  const [forcefield, setForcefield] = useState<string>('MMFF94');

  const [dockingRunning, setDockingRunning] = useState<boolean>(false);
  const [poses, setPoses] = useState<DockingPose[]>([]);
  const [selectedPose, setSelectedPose] = useState<DockingPose | null>(null);

  const [receptorPdbqt, setReceptorPdbqt] = useState<string | undefined>(undefined);
  const [ligandPdbqt, setLigandPdbqt] = useState<string | undefined>(undefined);
  const [rawLog, setRawLog] = useState<string | undefined>(undefined);
  const [vinaCmd, setVinaCmd] = useState<string | undefined>(undefined);

  const [aiReport, setAiReport] = useState<AIInsightReport | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState<boolean>(false);

  const handleProteinLoaded = (p: ProteinMetadata) => {
    setProtein(p);
    setGridCenter(p.center);
  };

  const handleLigandPrepared = (l: LigandMetadata) => {
    setLigand(l);
    if (l.pdbqt_content) {
      setLigandPdbqt(l.pdbqt_content);
    }
  };

  const handleStartDocking = async () => {
    if (!protein || !ligand) return;

    try {
      setDockingRunning(true);
      setPoses([]);
      setSelectedPose(null);
      setAiReport(null);
      setRawLog(undefined);
      setVinaCmd(undefined);

      const job = await apiClient.runDocking({
        pdb_id: protein.pdb_id,
        ligand_smiles: ligand.smiles,
        ligand_name: ligand.name,
        grid_center: gridCenter,
        grid_size: gridSize,
        exhaustiveness: exhaustiveness,
        energy_range: energyRange,
        num_modes: numModes,
        forcefield: forcefield,
      });

      // Poll job status
      let pollCount = 0;
      const interval = setInterval(async () => {
        pollCount += 1;
        const statusRes = await apiClient.getJobStatus(job.job_id);

        if (statusRes.status === 'COMPLETED' && statusRes.poses) {
          clearInterval(interval);
          setDockingRunning(false);
          setPoses(statusRes.poses);
          setReceptorPdbqt(statusRes.receptor_pdbqt);
          setLigandPdbqt(statusRes.ligand_pdbqt || ligand.pdbqt_content);
          setRawLog(statusRes.raw_log);
          setVinaCmd(statusRes.vina_cmd);

          if (statusRes.poses.length > 0) {
            setSelectedPose(statusRes.poses[0]);
          }

          // Trigger AI report analysis
          setAiReportLoading(true);
          try {
            const report = await apiClient.getAIInsightReport(job.job_id);
            setAiReport(report);
          } catch (e) {
            console.error("AI report failed:", e);
          } finally {
            setAiReportLoading(false);
          }
        } else if (statusRes.status === 'FAILED' || pollCount > 30) {
          clearInterval(interval);
          setDockingRunning(false);
          alert(statusRes.error_message || "Docking job execution failed or timed out.");
        }
      }, 1000);

    } catch (err: any) {
      setDockingRunning(false);
      alert(err.response?.data?.detail || "Failed to initiate AutoDock Vina execution.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Left Column: Interactive Controls & Parameters */}
      <div className="lg:col-span-5 space-y-5">
        <ProteinForm onProteinLoaded={handleProteinLoaded} />
        <LigandForm onLigandPrepared={handleLigandPrepared} />
        <GridBoxControls
          pdbId={protein?.pdb_id}
          gridCenter={gridCenter}
          gridSize={gridSize}
          onChangeCenter={setGridCenter}
          onChangeSize={setGridSize}
        />

        {/* Advanced Scientific Parameters Accordion */}
        <AdvancedSettingsAccordion
          exhaustiveness={exhaustiveness}
          energyRange={energyRange}
          numModes={numModes}
          forcefield={forcefield}
          onChangeExhaustiveness={setExhaustiveness}
          onChangeEnergyRange={setEnergyRange}
          onChangeNumModes={setNumModes}
          onChangeForcefield={setForcefield}
        />

        {/* Launch Docking Execution Button */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <button
            onClick={handleStartDocking}
            disabled={!protein || !ligand || dockingRunning}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30"
          >
            {dockingRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running AutoDock Vina Engine (Exhaustiveness: {exhaustiveness})...
              </>
            ) : (
              <>
                <span>⚡ Execute Docking Job</span>
              </>
            )}
          </button>

          {(!protein || !ligand) && (
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Please load target protein and prepare ligand conformer before launching.
            </p>
          )}
        </div>

        {/* Scientific File Exporters */}
        <FileExporterPanel
          receptorPdbqt={receptorPdbqt}
          ligandPdbqt={ligandPdbqt}
          poses={poses}
          rawLog={rawLog}
          pdbId={protein?.pdb_id}
          ligandName={ligand?.name}
        />
      </div>

      {/* Right Column: 3D Viewport, Scores, Terminal & AI Report */}
      <div className="lg:col-span-7 space-y-6">
        {/* 3D WebGL Viewport */}
        <div className="h-[480px]">
          <Mol3DErrorBoundary>
            <ProteinViewer
              pdbData={protein?.pdb_content}
              ligandPdbqt={selectedPose?.pdbqt_content || ligand?.pdbqt_content}
              gridBoxCenter={gridCenter}
              gridBoxSize={gridSize}
            />
          </Mol3DErrorBoundary>
        </div>

        {/* Score Table */}
        <ScoreTable
          poses={poses}
          selectedPoseMode={selectedPose?.mode}
          onSelectPose={setSelectedPose}
        />

        {/* Terminal Execution Log Console */}
        <TerminalConsoleLog vinaCmd={vinaCmd} rawLog={rawLog} />

        {/* AI Insight Report Card */}
        <InsightReportCard report={aiReport || undefined} loading={aiReportLoading} />
      </div>
    </div>
  );
}
