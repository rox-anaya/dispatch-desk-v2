import { getAllAircraft } from "@/lib/data/lookups";
import { createDispatchAction } from "@/lib/dispatch/create-dispatch";

export default async function NewDispatchPage() {
  const aircraftList = await getAllAircraft();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Dispatch</h1>
          <p className="text-sm text-slate-400 mt-1">Generate automated flight plan calculations and weights</p>
        </div>

        <form action={createDispatchAction} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Departure ICAO
              </label>
              <input
                name="depIcao"
                type="text"
                placeholder="EGLL"
                required
                maxLength={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Arrival ICAO
              </label>
              <input
                name="arrIcao"
                type="text"
                placeholder="KJFK"
                required
                maxLength={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Aircraft Model
            </label>
            <select
              name="aircraftId"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="" className="bg-slate-900 text-slate-400">Select Aircraft...</option>
              {aircraftList.map((ac) => (
                <option key={ac.id} value={ac.id} className="bg-slate-900 text-white">
                  {ac.model} ({ac.type_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Payload (kg)
            </label>
            <input
              name="payloadKg"
              type="number"
              placeholder="12000"
              defaultValue={12000}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all"
          >
            Generate Dispatch
          </button>
        </form>
      </div>
    </div>
  );
}
