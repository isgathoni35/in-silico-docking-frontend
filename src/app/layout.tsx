import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "In-Silico Ligand-Docking & 3D Visualization Platform",
  description: "Web-native micro-SaaS computational biology platform for protein-ligand docking, 3D structure visualization, and AI active site analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-cyan-500/20">
                ⚡
              </div>
              <div>
                <h1 className="font-bold text-sm text-slate-100 tracking-tight">In-Silico Docking 3D</h1>
                <span className="text-[10px] text-cyan-400 font-mono">Computational Biochemistry Platform</span>
              </div>
            </div>
            <nav className="flex items-center gap-6 text-xs font-medium text-slate-400">
              <a href="/" className="hover:text-cyan-400 transition">Overview</a>
              <a href="/docking" className="hover:text-cyan-400 text-cyan-400 transition font-semibold">Docking Dashboard</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>

        <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
          In-Silico Ligand-Docking & 3D Visualization Platform • Powered by Next.js, FastAPI, RDKit, AutoDock Vina & Gemini API
        </footer>
      </body>
    </html>
  );
}
