import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6">
      <div className="w-full max-w-md"></div>

      {/* Center Card */}
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/60 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
        
        {/* App Logo & Branding */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <svg className="w-8 h-8 text-white transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
              Atlas Virtual
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1 tracking-tight">
              Dispatch Desk V2
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Advanced Flight Planning & Operations Platform
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="space-y-3 pt-4">
          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Open Pilot Dashboard</span>
            <span className="font-mono">→</span>
          </Link>
          <Link
            href="/dispatch/new"
            className="block w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-3.5 text-sm font-semibold text-slate-200 transition-all border border-slate-700/80"
          >
            Create Flight Dispatch
          </Link>
        </div>
      </div>

      {/* Footer Credits & Copyright */}
      <footer className="w-full text-center py-4 space-y-1">
        <p className="text-xs font-mono text-slate-500">
          Atlas Virtual Flight Operations System
        </p>
        <p className="text-[11px] text-slate-600 font-mono">
          © {new Date().getFullYear()} Atlas Virtual. All rights reserved. Designed for Virtual Aviation.
        </p>
      </footer>
    </div>
  );
}
