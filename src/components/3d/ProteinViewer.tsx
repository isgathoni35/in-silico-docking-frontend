'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Vector3D } from '@/lib/types';

interface ProteinViewerProps {
  pdbData?: string;
  ligandPdbqt?: string;
  gridBoxCenter?: Vector3D;
  gridBoxSize?: Vector3D;
  styleRepresentation?: 'cartoon' | 'surface' | 'sphere' | 'stick';
}

export const ProteinViewer: React.FC<ProteinViewerProps> = ({
  pdbData,
  ligandPdbqt,
  gridBoxCenter,
  gridBoxSize,
  styleRepresentation = 'cartoon',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize 3Dmol Viewer dynamically
  useEffect(() => {
    let isMounted = true;

    const initViewer = async () => {
      if (!containerRef.current) return;

      try {
        setLoading(true);
        // Load $3Dmol from window or dynamic import
        const $3Dmol = (await import('3dmol')).default || (window as any).$3Dmol;

        if (containerRef.current && isMounted) {
          containerRef.current.innerHTML = '';
          const v = $3Dmol.createViewer(containerRef.current, {
            backgroundColor: '#0b0f17',
          });
          setViewer(v);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to initialize 3Dmol viewer:", err);
        setLoading(false);
      }
    };

    initViewer();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update rendering when data or representation changes
  useEffect(() => {
    if (!viewer) return;

    viewer.removeAllModels();
    viewer.removeAllShapes();

    // Render Protein
    if (pdbData) {
      viewer.addModel(pdbData, 'pdb');

      if (styleRepresentation === 'cartoon') {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      } else if (styleRepresentation === 'surface') {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewer.addSurface('VDW', { opacity: 0.7, colorscheme: 'amino' });
      } else if (styleRepresentation === 'sphere') {
        viewer.setStyle({}, { sphere: { scale: 0.3 } });
      } else {
        viewer.setStyle({}, { stick: {} });
      }
    }

    // Render Ligand Poses if available
    if (ligandPdbqt) {
      const ligandModel = viewer.addModel(ligandPdbqt, 'pdbqt');
      viewer.setStyle({ model: ligandModel }, { stick: { colorscheme: 'greenCarbon', radius: 0.25 } });
    }

    // Render Grid Bounding Box Overlay
    if (gridBoxCenter && gridBoxSize) {
      viewer.addBox({
        center: { x: gridBoxCenter.x, y: gridBoxCenter.y, z: gridBoxCenter.z },
        dimensions: { w: gridBoxSize.x, h: gridBoxSize.y, d: gridBoxSize.z },
        color: '#06b6d4',
        wireframe: true,
      });
    }

    viewer.zoomTo();
    viewer.render();
  }, [viewer, pdbData, ligandPdbqt, gridBoxCenter, gridBoxSize, styleRepresentation]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400 font-medium">Initializing 3Dmol WebGL Engine...</span>
          </div>
        </div>
      )}

      {!pdbData && !loading && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-6 z-0">
          <div className="max-w-md">
            <svg className="w-12 h-12 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.6 1.601a2 2 0 00.586 3.414l2.428.809a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.022-.547l1.6-1.6a2 2 0 00-.586-3.415l-2.428-.809z" />
            </svg>
            <h3 className="text-sm font-semibold text-slate-300">No Macromolecular Structure Loaded</h3>
            <p className="text-xs text-slate-500 mt-1">Select or load a protein PDB ID (e.g., 1CAG) to view 3D macromolecular structures and active site bounding box.</p>
          </div>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full min-h-[480px]" />
    </div>
  );
};
