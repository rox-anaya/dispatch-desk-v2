import Link from "next/link";
import WeatherPanel from "@/components/weather/WeatherPanel";
import RouteMap from "@/components/dispatch/RouteMap";

export const dynamic = "force-dynamic";

export default async function DispatchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ dep?: string; arr?: string; id?: string }>;
}) {
  const params = await searchParams;
  const depIcao = params.dep || "EDDF";
  const arrIcao = params.arr || "LFPG";
  const dispatchId = params.id;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
            FLIGHT PLAN GENERATED SUCCESSFULLY
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            {depIcao} → {arrIcao}
          </h1>
        </div>

        {/* Interactive Route Map Preview */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Interactive Route Map</span>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">LIVE GIS</span>
          </div>
          <RouteMap depIcao={depIcao} arrIcao={arrIcao} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherPanel icao={depIcao} label="Departure WX" />
          <WeatherPanel icao={arrIcao} label="Arrival WX" />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-mono">ATC Route String</span>
          <p className="font-mono text-sm text-blue-300">{depIcao} DCT {arrIcao}</p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {dispatchId && (
            <Link
              href={`/dispatch/${dispatchId}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all"
            >
              View Full Dispatch Record & Details →
            </Link>
          )}
          <a
            href={`/api/dispatch/fpl?dep=${depIcao}&arr=${arrIcao}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all"
          >
            Download .FPL (Infinite Flight)
          </a>
          <a
            href={`/api/dispatch/kml?dep=${depIcao}&arr=${arrIcao}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all"
          >
            Download KML
          </a>
          <a
            href="https://simbrief.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-3.5 text-sm font-semibold text-slate-200 transition-all"
          >
            Open SimBrief
          </a>
        </div>

        <div className="pt-2">
          <Link
            href="/dispatch/new"
            className="block w-full rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 py-3 text-center text-xs font-semibold text-slate-400 font-mono transition-all"
          >
            ← Generate Another Flight
          </Link>
        </div>
      </div>
    </div>
  );
}
