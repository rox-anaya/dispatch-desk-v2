import { getDispatchById } from "@/lib/data/dispatch-queries";
import { notFound } from "next/navigation";

export default async function DispatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dispatch = await getDispatchById(id);

  if (!dispatch) return notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {dispatch.status}
          </span>
          <h1 className="text-3xl font-bold text-white mt-2">
            {dispatch.dep_icao} $\rightarrow$ {dispatch.arr_icao}
          </h1>
          <p className="text-sm text-slate-400">Dispatch Release #{dispatch.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="block text-xs font-medium text-slate-500 uppercase">Distance</span>
          <span className="text-2xl font-bold text-white">{dispatch.distance_nm} NM</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="block text-xs font-medium text-slate-500 uppercase">Cruise Altitude</span>
          <span className="text-2xl font-bold text-white">FL{dispatch.cruise_altitude / 100}</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="block text-xs font-medium text-slate-500 uppercase">Block Time</span>
          <span className="text-2xl font-bold text-white">{dispatch.block_time_hours} hrs</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Fuel & Weight Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-slate-500 text-xs">Trip Fuel</span>
            <span className="font-mono text-white text-base">{dispatch.trip_fuel_kg} kg</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Reserve Fuel</span>
            <span className="font-mono text-white text-base">{dispatch.reserve_fuel_kg} kg</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Total Fuel</span>
            <span className="font-mono text-white text-base">{dispatch.total_fuel_kg} kg</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Takeoff Weight (TOW)</span>
            <span className="font-mono text-white text-base">{dispatch.tow_kg} kg</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-2">
        <h2 className="text-lg font-semibold text-white">Route</h2>
        <p className="font-mono text-sm text-blue-400 bg-slate-950 p-3 rounded-md border border-slate-800">
          {dispatch.dep_icao} {dispatch.route} {dispatch.arr_icao}
        </p>
        <p className="text-xs text-slate-500">
          Note: Direct (DCT) placeholder route active until airway navigation data import in Module 7.
        </p>
      </div>
    </div>
  );
}
