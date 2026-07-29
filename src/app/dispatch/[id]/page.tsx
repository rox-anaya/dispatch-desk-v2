import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import WeatherPanel from "@/components/weather/WeatherPanel";

export const dynamic = "force-dynamic";

export default async function DispatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: dispatch, error } = await supabase
    .from("dispatches")
    .select(`*, aircraft (*)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !dispatch) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-red-400">Dispatch Not Found</h1>
          <p className="text-slate-400">Could not locate flight plan #{id}</p>
          <Link href="/dispatch/new" className="text-blue-400 hover:underline block mt-4">← Generate a New Flight</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center py-12">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              OFP RELEASE #{id.slice(0, 8)}
            </span>
            <h1 className="text-3xl font-bold text-white mt-1">{dispatch.dep_icao} → {dispatch.arr_icao}</h1>
          </div>
          <span className="w-max rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase">
            {dispatch.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Aircraft</span>
            <p className="text-lg font-bold text-white mt-1">{dispatch.aircraft?.model || "Unknown"}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Distance</span>
            <p className="text-lg font-bold text-white mt-1">{dispatch.distance_nm} NM</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Cruise Alt</span>
            <p className="text-lg font-bold text-white mt-1">FL{Math.round(dispatch.cruise_altitude / 100)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Block Time</span>
            <p className="text-lg font-bold text-white mt-1">{dispatch.block_time_hours} hrs</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Total Fuel</span>
            <p className="text-lg font-bold text-amber-400 mt-1">{dispatch.total_fuel_kg?.toLocaleString()} kg</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 uppercase font-mono">Takeoff Weight</span>
            <p className="text-lg font-bold text-white mt-1">{dispatch.tow_kg?.toLocaleString()} kg</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherPanel icao={dispatch.dep_icao} label="Departure" />
          <WeatherPanel icao={dispatch.arr_icao} label="Arrival" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <a href={`https://www.simbrief.com/system/dispatch.php?orig=${dispatch.dep_icao}&dest=${dispatch.arr_icao}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all">Export / Load in SimBrief ✈️</a>
          <Link href="/dispatch/new" className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 py-3 text-center text-sm font-semibold text-slate-200 transition-all">← Generate Another Flight</Link>
        </div>
      </div>
    </div>
  );
}
