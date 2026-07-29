import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function seed() {
  console.log("Seeding Database...");
  // Add Airports
  await supabase.from("airports").upsert([
    { icao: "VOBL", name: "Kempegowda International", latitude: 13.1979, longitude: 77.7063 },
    { icao: "VABB", name: "Chhatrapati Shivaji", latitude: 19.0887, longitude: 72.8679 },
    { icao: "EGLL", name: "Heathrow", latitude: 51.4706, longitude: -0.461941 },
    { icao: "KJFK", name: "JFK", latitude: 40.6398, longitude: -73.7789 }
  ], { onConflict: "icao" });

  // Add Aircraft
  await supabase.from("aircraft").upsert([
    { model: "Boeing 777-300ER", type_code: "B77W", cruise_speed_kts: 488, fuel_burn_kg_hr: 7500, empty_weight_kg: 167829, max_payload_kg: 69853, max_fuel_kg: 145538, max_tow_kg: 351533 },
    { model: "Airbus A350-900", type_code: "A359", cruise_speed_kts: 488, fuel_burn_kg_hr: 5800, empty_weight_kg: 142400, max_payload_kg: 53300, max_fuel_kg: 110523, max_tow_kg: 280000 }
  ], { onConflict: "type_code" });
  console.log("Database Seeded Successfully!");
}
seed();
