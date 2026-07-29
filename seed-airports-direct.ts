import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const majorAirports = [
  { icao: "EGLL", iata: "LHR", name: "London Heathrow Airport", city: "London", country: "GB", latitude: 51.4706, longitude: -0.461941, elevation_ft: 83 },
  { icao: "KJFK", iata: "JFK", name: "John F Kennedy International Airport", city: "New York", country: "US", latitude: 40.639801, longitude: -73.7789, elevation_ft: 13 },
  { icao: "VOBL", iata: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", country: "IN", latitude: 13.1979, longitude: 77.7063, elevation_ft: 3000 },
  { icao: "OMDB", iata: "DXB", name: "Dubai International Airport", city: "Dubai", country: "AE", latitude: 25.2532, longitude: 55.3657, elevation_ft: 62 },
  { icao: "KSFO", iata: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "US", latitude: 37.619, longitude: -122.375, elevation_ft: 13 },
  { icao: "VABB", iata: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "IN", latitude: 19.0887, longitude: 72.8679, elevation_ft: 39 },
];

async function seed() {
  console.log("Seeding key airports directly into Supabase...");
  const { data, error } = await supabase.from("airports").upsert(majorAirports, { onConflict: "icao" });
  if (error) {
    console.error("Airport seed error:", error.message);
  } else {
    console.log("Successfully seeded major airports into Supabase!");
  }
}

seed();
