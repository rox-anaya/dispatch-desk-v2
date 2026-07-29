"use client";

import { useState, useEffect } from "react";
import { createDispatchAction } from "@/lib/dispatch/create-dispatch";
import { createClient } from "@/lib/supabase/client";

export default function NewDispatchPage() {
  const [aircraftList, setAircraftList] = useState<any[]>([]);
  const [depIcao, setDepIcao] = useState("");
  const [arrIcao, setArrIcao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAircraft() {
      const supabase = createClient();
      const { data, error } = await supabase.from("aircraft").select("*").order("model");
      if (data) setAircraftList(data);
    }
    loadAircraft();
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createDispatchAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Dispatch</h1>
          <p className="text-sm text-slate-400 mt-1">Generate automated flight plan calculations and weights</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Departure ICAO
              </label>
              <input
                name="depIcao"
                type="text"
                placeholder="EGLL"
                value={depIcao}
                onChange={(e) => setDepIcao(e.target.value.toUpperCase())}
                required
                maxLength={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                value={arrIcao}
                onChange={(e) => setArrIcao(e.target.value.toUpperCase())}
                required
                maxLength={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
          >
            {loading ? "Calculating & Generating..." : "Generate Dispatch"}
          </button>
        </form>
      </div>
    </div>
  );
}
