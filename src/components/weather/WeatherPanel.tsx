import { getMetar, getTaf } from "@/lib/weather/aviation-weather-client";

export default async function WeatherPanel({ icao, label }: { icao: string; label: string }) {
  const metar = await getMetar(icao);
  const taf = await getTaf(icao);

  const flightCategory = metar?.fltcat || "UNK";

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "VFR": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "MVFR": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "IFR": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "LIFR": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs text-slate-400 uppercase font-mono">{label} WX - {icao}</span>
        {metar && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryColor(flightCategory)} tracking-widest`}>
            {flightCategory}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">METAR</span>
          <p className="font-mono text-xs text-slate-300 break-words mt-1 leading-relaxed">
            {metar ? metar.rawOb : <span className="text-slate-500 italic">No METAR data available.</span>}
          </p>
        </div>
        
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">TAF</span>
          <p className="font-mono text-xs text-slate-300 break-words mt-1 leading-relaxed">
            {taf && taf.rawTAF ? taf.rawTAF : <span className="text-slate-500 italic">No TAF data available.</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
