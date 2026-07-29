"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_AIRCRAFT = [
  { id: "fallback-a320", model: "Airbus A320-200", type_code: "A320" },
  { id: "fallback-b738", model: "Boeing 737-800", type_code: "B738" },
  { id: "fallback-b77w", model: "Boeing 777-300ER", type_code: "B77W" },
  { id: "fallback-a359", model: "Airbus A350-900", type_code: "A359" },
  { id: "fallback-crj9", model: "Bombardier CRJ-900", type_code: "CRJ9" },
];

export default function NewDispatchPage() {
  const [aircraftList, setAircraftList] = useState<any[]>(FALLBACK_AIRCRAFT);
  const [depIcao, setDepIcao] = useState("EGLL");
  const [arrIcao, setArrIcao] = useState("KJFK");
  const [aircraftId, setAircraftId] = useState("fallback-b77w");
  const [payloadKg, setPayloadKg] = useState("12000");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAircraft() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("aircraft").select("*").order("model");
        if (data && data.length > 0) {
          setAircraftList(data);
          setAircraftId(data[0].id);
        }
      } catch (err) {
        // Keeps fallback list active
      }
    }
    loadAircraft();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depIcao,
          arrIcao,
          aircraftId,
          payloadKg,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to generate dispatch.");
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      setError(err?.message || "A network error occurred. Please try again.");
    } finally {
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
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 font-medium shadow-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Departure ICAO
              </label>
              <input
                type="text"
                value={depIcao}
                onChange={(e) => setDepIcao(e.target.value.toUpperCase())}
                required
                maxLength={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Arrival ICAO
              </label>
              <input
                type="text"
                value={arrIcao}
                onChange={(e) => setArrIcao(e.target.value.toUpperCase())}
                required
                maxLength={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Aircraft Model
            </label>
            <select
              value={aircraftId}
              onChange={(e) => setAircraftId(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
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
              type="number"
              value={payloadKg}
              onChange={(e) => setPayloadKg(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
          >
            {loading ? "Calculating Flight Plan..." : "Generate Dispatch"}
          </button>
        </form>
      </div>
    </div>
  );
}
