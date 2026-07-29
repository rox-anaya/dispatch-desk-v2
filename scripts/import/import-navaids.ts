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
  const url = "https://davidmegginson.github.io/ourairports-data/navaids.csv";
  console.log("Fetching navaids CSV...");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch navaids CSV: ${res.statusText}`);
  const csvText = await res.text();

  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = parseCSVLine(lines[0]);

  const seen = new Set<string>();
  const navaidsToInsert: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < headers.length) continue;
    const r: any = {};
    headers.forEach((h, idx) => (r[h] = cols[idx]));

    if (r.ident && r.type) {
      const rawType = r.type.toLowerCase().trim();
      let type: string | null = null;

      if (rawType.includes("vor")) {
        type = "vor";
      } else if (rawType.includes("ndb")) {
        type = "ndb";
      } else if (rawType.includes("fix") || rawType.includes("waypoint")) {
        type = "waypoint";
      }

      if (type) {
        const key = `${r.ident}_${type}`;
        if (!seen.has(key)) {
          seen.add(key);
          navaidsToInsert.push({
            ident: r.ident,
            type: type,
            latitude: r.latitude_deg ? parseFloat(r.latitude_deg) : 0,
            longitude: r.longitude_deg ? parseFloat(r.longitude_deg) : 0,
          });
        }
      }
    }
  }

  console.log(`Parsed ${navaidsToInsert.length} valid navaids.`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < navaidsToInsert.length; i += BATCH_SIZE) {
    const batch = navaidsToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("navaids").upsert(batch, { onConflict: "ident,type" });
    if (error) {
      console.error(`Error inserting navaids batch at ${i}:`, error.message);
    } else {
      console.log(`Upserted ${i + batch.length} / ${navaidsToInsert.length} navaids...`);
    }
  }

  console.log("Navaids import complete!");
}

main();
