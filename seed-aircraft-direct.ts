import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const aircraftData = [
  {
    model: "Airbus A320-200",
    type_code: "A320",
    cruise_speed_kts: 450,
    fuel_burn_kg_hr: 2400,
    empty_weight_kg: 42600,
    max_payload_kg: 16600,
    max_fuel_kg: 18730,
    max_tow_kg: 77000,
  },
  {
    model: "Boeing 737-800",
    type_code: "B738",
    cruise_speed_kts: 453,
    fuel_burn_kg_hr: 2500,
    empty_weight_kg: 41413,
    max_payload_kg: 20540,
    max_fuel_kg: 20894,
    max_tow_kg: 79015,
  },
  {
    model: "Boeing 777-300ER",
    type_code: "B77W",
    cruise_speed_kts: 488,
    fuel_burn_kg_hr: 7500,
    empty_weight_kg: 167829,
    max_payload_kg: 69853,
    max_fuel_kg: 145538,
    max_tow_kg: 351533,
  },
  {
    model: "Airbus A350-900",
    type_code: "A359",
    cruise_speed_kts: 488,
    fuel_burn_kg_hr: 5800,
    empty_weight_kg: 115700,
    max_payload_kg: 53300,
    max_fuel_kg: 110000,
    max_tow_kg: 280000,
  },
  {
    model: "Bombardier CRJ-900",
    type_code: "CRJ9",
    cruise_speed_kts: 470,
    fuel_burn_kg_hr: 1600,
    empty_weight_kg: 21845,
    max_payload_kg: 10250,
    max_fuel_kg: 8888,
    max_tow_kg: 38329,
  }
];

async function seed() {
  console.log("Seeding aircraft data to Supabase...");
  const { data, error } = await supabase
    .from("aircraft")
    .upsert(aircraftData, { onConflict: "type_code" });

  if (error) {
    console.error("Failed to seed aircraft:", error.message);
  } else {
    console.log("Successfully seeded aircraft into Supabase!");
  }
}

seed();
