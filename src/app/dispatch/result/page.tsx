import Link from "next/link";
import WeatherPanel from "@/components/weather/WeatherPanel";

export const dynamic = "force-dynamic";

export default async function DispatchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const depIcao = params.dep || "VOBL";
  const arrIcao = params.arr || "VABB";
  const model = params.model || "Boeing 777-300ER";
  const distance = params.dist ? parseFloat(params.dist) : 500;
  const cruiseAlt = params.alt ? `FL${Math.round(parseFloat(params.alt) / 100)}` : "FL370";
  const blockTime = params.time ? parseFloat(params.time) : 1.5;
  const totalFuel = params.fuel ? parseFloat(params.fuel) : 15000;
  const tow = params.tow ? parseFloat(params.tow) : 200000;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center py-12">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              OFP RELEASE #LIVE-GEN
            </span>
            <h1 className="text-3xl font-bold text-white mt-1">
              {depIcao} → {arrIcao}
            </h1>
          </div>
          <span className="w-max rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase">
            PLANNED
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Aircraft</span>
            <p className="text-lg font-bold text-white mt-1">{model}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Distance</span>
            <p className="text-lg font-bold text-white mt-1">{distance} NM</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Cruise Alt</span>
            <p className="text-lg font-bold text-white mt-1">{cruiseAlt}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Block Time</span>
            <p className="text-lg font-bold text-white mt-1">{blockTime} hrs</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Total Fuel</span>
            <p className="text-lg font-bold text-amber-400 mt-1">{totalFuel.toLocaleString()} kg</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Takeoff Weight</span>
            <p className="text-lg font-bold text-white mt-1">{tow.toLocaleString()} kg</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherPanel icao={depIcao} label="Departure" />
          <WeatherPanel icao={arrIcao} label="Arrival" />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-mono">ATC Route String</span>
          <p className="font-mono text-sm text-blue-300 break-all">{depIcao} DCT {arrIcao}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <a
            href={`https://www.simbrief.com/system/dispatch.php?orig=${depIcao}&dest=${arrIcao}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all"
          >
            Export / Load in SimBrief ✈️
          </a>
          <Link
            href="/dispatch/new"
            className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 py-3 text-center text-sm font-semibold text-slate-200 transition-all"
          >
            ← Generate Another Flight
          </Link>
        </div>
      </div>
    </div>
  );
}
