"use client";

import { useState, useEffect } from "react";
import { getAllAircraft } from "@/lib/data/lookups";
import { createDispatchAction } from "@/lib/dispatch/create-dispatch";

export default function NewDispatchPage() {
  const [aircraftList, setAircraftList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAircraft() {
      const data = await getAllAircraft();
      setAircraftList(data);
    }
    fetchAircraft();
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
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create New Dispatch</h1>
        <p className="text-sm text-slate-400">Generate automated flight plan calculations and weights</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Departure ICAO</label>
            <input
              name="depIcao"
              type="text"
              placeholder="e.g. EGLL"
              required
              maxLength={4}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Arrival ICAO</label>
            <input
              name="arrIcao"
              type="text"
              placeholder="e.g. KJFK"
              required
              maxLength={4}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Aircraft</label>
          <select
            name="aircraftId"
            required
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Aircraft...</option>
            {aircraftList.map((ac) => (
              <option key={ac.id} value={ac.id}>
                {ac.model} ({ac.type_code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Payload (kg)</label>
          <input
            name="payloadKg"
            type="number"
            placeholder="e.g. 15000"
            defaultValue={12000}
            required
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {loading ? "Calculating & Generating..." : "Generate Dispatch"}
        </button>
      </form>
    </div>
  );
}
