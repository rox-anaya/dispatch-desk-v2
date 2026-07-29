"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAirportByIcao } from "@/lib/data/lookups";
import { calculateFlightPlan } from "./calculations";
import { redirect } from "next/navigation";

export async function createDispatchAction(formData: FormData): Promise<void> {
  const depIcao = (formData.get("depIcao") as string)?.toUpperCase();
  const arrIcao = (formData.get("arrIcao") as string)?.toUpperCase();
  let aircraftId = formData.get("aircraftId") as string;
  const payloadKg = parseFloat((formData.get("payloadKg") as string) || "0");

  if (!depIcao || !arrIcao || !aircraftId) {
    throw new Error("Departure ICAO, Arrival ICAO, and Aircraft Selection are required.");
  }

  const supabase = createAdminClient();

  // If a fallback ID was passed, find the real DB aircraft record by type code
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
      .single();

    if (matched) {
      aircraftId = matched.id;
    }
  }

  const depAirport = await getAirportByIcao(depIcao);
  const arrAirport = await getAirportByIcao(arrIcao);

  if (!depAirport) throw new Error(`Departure airport ${depIcao} not found in database.`);
  if (!arrAirport) throw new Error(`Arrival airport ${arrIcao} not found in database.`);

  const { data: aircraft } = await supabase
    .from("aircraft")
    .select("*")
    .eq("id", aircraftId)
    .single();

  if (!aircraft) throw new Error("Selected aircraft model could not be found in database.");

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

  const { data, error } = await supabase
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

  if (error || !data) {
    throw new Error(`Failed to save dispatch release: ${error?.message}`);
  }

  redirect(`/dispatch/${data.id}`);
}
