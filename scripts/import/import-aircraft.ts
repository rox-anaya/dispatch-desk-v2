import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../../src/lib/supabase/admin";

async function main() {
  const supabase = createAdminClient();
  const filePath = path.join(process.cwd(), "scripts", "data", "aircraft-seed.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const aircraft = JSON.parse(rawData);

  console.log(`Found ${aircraft.length} aircraft in seed file.`);

  const formattedAircraft = aircraft.map((a: any) => ({
    icao_type: a.icao_code || a.icao || a.icao_type,
    name: a.model_name || a.name,
    typical_cruise_speed_kt: a.cruise_speed_kts || a.typical_cruise_speed_kt || 450,
    typical_cruise_altitude_ft: a.service_ceiling_ft || a.typical_cruise_altitude_ft || 35000,
    max_fuel_kg: a.max_fuel_kg || 20000,
    max_payload_kg: a.max_payload_kg || 18000,
    fuel_burn_kg_per_hr: a.fuel_burn_kg_per_hr || 2400
  }));

  const { data, error } = await supabase
    .from("aircraft")
    .upsert(formattedAircraft, { onConflict: "icao_type" })
    .select();

  if (error) {
    console.error("Error importing aircraft:", error.message);
    process.exit(1);
  }

  console.log(`Successfully imported ${data?.length || 0} aircraft into Supabase!`);
}

main();
