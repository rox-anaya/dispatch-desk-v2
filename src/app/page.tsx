import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/60 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
            ATLAS VIRTUAL
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Dispatch Desk V2
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Flight Planning & Dispatch Platform
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href="/dashboard"
            className="block w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg transition-all"
          >
            Open Pilot Dashboard →
          </Link>
          <Link
            href="/dispatch/new"
            className="block w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-3 text-sm font-semibold text-slate-200 transition-all border border-slate-700"
          >
            Create Flight Dispatch
          </Link>
        </div>
      </div>
    </div>
  );
}
