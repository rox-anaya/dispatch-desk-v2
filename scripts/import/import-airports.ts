import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../../src/lib/supabase/admin";

interface OurAirportRow {
  id: string;
  ident: string;
  type: string;
  name: string;
  latitude_deg: string;
  longitude_deg: string;
  elevation_ft: string;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  scheduled_service: string;
  gps_code: string;
  iota_code: string;
  local_code: string;
  home_link: string;
  wikipedia_link: string;
  keywords: string;
}

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
  const url = "https://davidmegginson.github.io/ourairports-data/airports.csv";
  console.log("Fetching airports CSV from OurAirports...");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch airports CSV: ${res.statusText}`);
  const csvText = await res.text();

  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = parseCSVLine(lines[0]);
  console.log(`Total CSV lines (including header): ${lines.length}`);

  const rawRows: OurAirportRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < headers.length) continue;
    const rowObj: any = {};
    headers.forEach((h, index) => {
      rowObj[h] = cols[index];
    });
    rawRows.push(rowObj as OurAirportRow);
  }

  const validTypes = ["large_airport", "medium_airport", "small_airport"];
  const filtered = rawRows.filter(
    (r) => validTypes.includes(r.type) && r.ident && r.ident.length >= 3 && r.ident.length <= 4
  );

  console.log(`Filtered to ${filtered.length} relevant airports.`);

  const records = filtered.map((r) => ({
    icao: r.ident.toUpperCase(),
    iata: r.iota_code || null,
    name: r.name,
    city: r.municipality || null,
    country: r.iso_country,
    latitude: parseFloat(r.latitude_deg),
    longitude: parseFloat(r.longitude_deg),
    elevation_ft: r.elevation_ft ? parseInt(r.elevation_ft, 10) : null,
  }));

  const BATCH_SIZE = 500;
  let totalUpserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("airports").upsert(batch, { onConflict: "icao" });

    if (error) {
      console.error(`Error upserting batch at index ${i}:`, error.message);
    } else {
      totalUpserted += batch.length;
      console.log(`Upserted ${totalUpserted} / ${records.length} airports...`);
    }
  }

  console.log("Airports import complete!");
}

main();
