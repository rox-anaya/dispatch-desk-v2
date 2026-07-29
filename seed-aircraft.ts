import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
    const { data: ac } = await supabase.from("aircraft").select("id").limit(1);
    if (!ac || ac.length === 0) {
        console.log("Seeding default Boeing 777-300ER...");
        await supabase.from("aircraft").insert({
            model: "Boeing 777-300ER",
            type_code: "B77W",
            cruise_speed_kts: 488,
            fuel_burn_kg_hr: 7500,
            empty_weight_kg: 167829,
            max_payload_kg: 69853,
            max_fuel_kg: 145538,
            max_tow_kg: 351533
        });
        console.log("Aircraft seeded successfully!");
    } else {
        console.log("Aircraft already exists.");
    }
}
run();
