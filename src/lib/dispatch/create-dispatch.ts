"use server";

import { createClient } from "@supabase/supabase-js";
import { calculateFlightPlan } from "./calculations";

export async function createDispatchAction(formData: FormData): Promise<{ error?: string; redirectUrl?: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return { error: "Server Configuration Error: Missing Supabase Environment Variables in Vercel." };
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const depIcao = (formData.get("depIcao") as string)?.toUpperCase()?.trim();
    const arrIcao = (formData.get("arrIcao") as string)?.toUpperCase()?.trim();
    let aircraftId = formData.get("aircraftId") as string;
    const payloadKg = parseFloat((formData.get("payloadKg") as string) || "0");

    if (!depIcao || !arrIcao || !aircraftId) {
      return { error: "Departure ICAO, Arrival ICAO, and Aircraft Selection are required." };
    }

    // Handle fallback ID mapping
    if (aircraftId.startsWith("fallback-")) {
      const typeCodeMap: Record<string, string> = {
        "fallback-a320": "A320",
        "fallback-b738": "B738",
        "fallback-b77w": "B77W",
        "fallback-a359": "A359",
        "fallback-crj9": "CRJ9",
      };
      const code = typeCodeMap[aircraftId] || "B77W";
      const { data: matched } = await supabase
        .from("aircraft")
        .select("*")
        .eq("type_code", code)
        .maybeSingle();

      if (matched) {
        aircraftId = matched.id;
      }
    }

    // Lookup Airports
    const { data: depAirport } = await supabase.from("airports").select("*").eq("icao", depIcao).maybeSingle();
    const { data: arrAirport } = await supabase.from("airports").select("*").eq("icao", arrIcao).maybeSingle();

    if (!depAirport) return { error: `Departure airport "${depIcao}" not found in database.` };
    if (!arrAirport) return { error: `Arrival airport "${arrIcao}" not found in database.` };

    // Lookup Aircraft
    const { data: aircraft, error: acError } = await supabase
      .from("aircraft")
      .select("*")
      .eq("id", aircraftId)
      .maybeSingle();

    if (acError || !aircraft) {
      return { error: `Aircraft lookup failed: ${acError?.message || "Selected model not found in DB"}` };
    }

    // Perform Calculations
    const calculations = calculateFlightPlan({
      depLat: depAirport.latitude,
      depLon: depAirport.longitude,
      arrLat: arrAirport.latitude,
      arrLon: arrAirport.longitude,
      cruiseSpeedKts: aircraft.cruise_speed_kts,
      fuelBurnKgHr: aircraft.fuel_burn_kg_hr,
      emptyWeightKg: aircraft.empty_weight_kg,
      maxPayloadKg: aircraft.max_payload_kg,
      maxFuelKg: aircraft.max_fuel_kg,
      maxTowKg: aircraft.max_tow_kg,
      payloadKg,
    });

    // Save Dispatch
    const { data: newDispatch, error: insertError } = await supabase
      .from("dispatches")
      .insert({
        dep_icao: depAirport.icao,
        arr_icao: arrAirport.icao,
        aircraft_id: aircraft.id,
        distance_nm: calculations.distanceNm,
        cruise_altitude: calculations.cruiseAltitudeFt,
        block_time_hours: calculations.blockTimeHours,
        trip_fuel_kg: calculations.tripFuelKg,
        reserve_fuel_kg: calculations.reserveFuelKg,
        total_fuel_kg: calculations.totalFuelKg,
        tow_kg: calculations.towKg,
        payload_kg: payloadKg,
        route: "DCT",
        status: "PLANNED",
      })
      .select("id")
      .single();

    if (insertError || !newDispatch) {
      return { error: `Database insert failed: ${insertError?.message}` };
    }

    return { redirectUrl: `/dispatch/${newDispatch.id}` };
  } catch (err: any) {
    return { error: `Unexpected error: ${err?.message || String(err)}` };
  }
}
