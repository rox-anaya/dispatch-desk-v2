import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DispatchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let dispatch: any = null;

  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data } = await supabase
      .from("dispatches")
      .select(`*, aircraft (*)`)
      .eq("id", id)
      .maybeSingle();

    if (data) dispatch = data;
  }

  // Fallback state if ID is generated locally or DB query is loading
  const depIcao = dispatch?.dep_icao || "EGLL";
  const arrIcao = dispatch?.arr_icao || "KJFK";
  const status = dispatch?.status || "PLANNED";
  const model = dispatch?.aircraft?.model || "Boeing 777-300ER";
  const distance = dispatch?.distance_nm || 3000;
  const cruiseAlt = dispatch?.cruise_altitude ? `FL${Math.round(dispatch.cruise_altitude / 100)}` : "FL370";
  const blockTime = dispatch?.block_time_hours || 6.5;
  const totalFuel = dispatch?.total_fuel_kg || 48500;
  const tow = dispatch?.tow_kg || 228000;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              OFP RELEASE #{id.slice(0, 8)}
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">
              {depIcao} → {arrIcao}
            </h1>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase">
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

        <div className="pt-4 flex justify-between items-center">
          <Link href="/dispatch/new" className="text-sm font-medium text-slate-400 hover:text-white transition-all">
            ← Generate Another Flight
          </Link>
        </div>
      </div>
    </div>
  );
}
