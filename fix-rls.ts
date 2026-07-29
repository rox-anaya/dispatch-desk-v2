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

async function fix() {
  console.log("Ensuring dispatch table permissions and testing lookup...");

  // 1. Verify Aircraft
  const { data: ac, error: acErr } = await supabase.from("aircraft").select("*").limit(1);
  console.log("Aircraft query test:", { ac, acErr });

  // 2. Verify Airports
  const { data: ap, error: apErr } = await supabase.from("airports").select("*").eq("icao", "EGLL").single();
  console.log("Airport query test (EGLL):", { ap, apErr });
}

fix();
