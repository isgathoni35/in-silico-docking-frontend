import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center max-w-4xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Zero-Cost Micro-SaaS Computational Biology Suite
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight mb-6">
        In-Silico Ligand-Docking & <br />
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
          Interactive 3D WebGL Visualization
        </span>
      </h1>

      <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
        Seamlessly fetch PDB macromolecules, generate RDKit 3D conformers from SMILES strings, calculate binding free energies (kcal/mol) with AutoDock Vina, and extract AI literature active site insights.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/docking"
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-900/30 transition flex items-center gap-2"
        >
          Launch Docking Dashboard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left w-full">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">🧬</div>
          <h3 className="font-semibold text-sm text-slate-200 mb-1">RCSB & RDKit Integration</h3>
          <p className="text-xs text-slate-400">Automated protein PDB download and SMILES 3D conformer generation with Gasteiger charge assignment.</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">🎯</div>
          <h3 className="font-semibold text-sm text-slate-200 mb-1">AutoDock Vina Engine</h3>
          <p className="text-xs text-slate-400">Background docking calculation queue outputting top pose conformers and binding affinities.</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">🤖</div>
          <h3 className="font-semibold text-sm text-slate-200 mb-1">Gemini AI Active Site Insight</h3>
          <p className="text-xs text-slate-400">LLM-powered active site literature extraction and chemical binding energy interpretation.</p>
        </div>
      </div>
    </div>
  );
}
