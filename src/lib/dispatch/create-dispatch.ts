"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAirportByIcao, getAircraftById } from "@/lib/data/lookups";
import { calculateFlightPlan } from "./calculations";
import { redirect } from "next/navigation";

export async function createDispatchAction(formData: FormData): Promise<void> {
  const depIcao = formData.get("depIcao") as string;
  const arrIcao = formData.get("arrIcao") as string;
  const aircraftId = formData.get("aircraftId") as string;
  const payloadKg = parseFloat((formData.get("payloadKg") as string) || "0");

  if (!depIcao || !arrIcao || !aircraftId) {
    throw new Error("Departure, Arrival, and Aircraft are required.");
  }

  const depAirport = await getAirportByIcao(depIcao);
  const arrAirport = await getAirportByIcao(arrIcao);
  const aircraft = await getAircraftById(aircraftId);

  if (!depAirport) throw new Error(`Departure airport ${depIcao.toUpperCase()} not found.`);
  if (!arrAirport) throw new Error(`Arrival airport ${arrIcao.toUpperCase()} not found.`);
  if (!aircraft) throw new Error("Selected aircraft not found.");

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

  const supabase = createAdminClient();
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
    throw new Error(`Failed to save dispatch: ${error?.message}`);
  }

  redirect(`/dispatch/${data.id}`);
}
