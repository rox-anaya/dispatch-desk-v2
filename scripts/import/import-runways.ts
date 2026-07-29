import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../../src/lib/supabase/admin";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  const supabase = createAdminClient();
  const url = "https://davidmegginson.github.io/ourairports-data/runways.csv";
  console.log("Fetching runways CSV...");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch runways CSV: ${res.statusText}`);
  const csvText = await res.text();

  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = parseCSVLine(lines[0]);

  const { data: dbAirports, error: airportError } = await supabase
    .from("airports")
    .select("id, icao");

  if (airportError || !dbAirports) {
    console.error("Failed to fetch airports from DB:", airportError?.message);
    process.exit(1);
  }

  const icaoToId = new Map<string, string>();
  dbAirports.forEach((a) => icaoToId.set(a.icao, a.id));

  const runwaysToInsert: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < headers.length) continue;
    const r: any = {};
    headers.forEach((h, idx) => (r[h] = cols[idx]));

    if (r.airport_ident && icaoToId.has(r.airport_ident) && r.le_ident) {
      runwaysToInsert.push({
        airport_id: icaoToId.get(r.airport_ident)!,
        ident: r.le_ident,
        length_ft: r.length_ft ? parseInt(r.length_ft, 10) : null,
        width_ft: r.width_ft ? parseInt(r.width_ft, 10) : null,
        surface: r.surface || null,
        heading_deg: r.le_heading_degT ? parseFloat(r.le_heading_degT) : null,
      });
    }
  }

  console.log(`Parsed ${runwaysToInsert.length} matching runways.`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < runwaysToInsert.length; i += BATCH_SIZE) {
    const batch = runwaysToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("runways").upsert(batch);
    if (error) console.error(`Error inserting runways batch at ${i}:`, error.message);
    else console.log(`Upserted ${i + batch.length} / ${runwaysToInsert.length} runways...`);
  }

  console.log("Runways import complete!");
}

main();
