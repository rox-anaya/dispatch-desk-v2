import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateFlightPlan } from "@/lib/dispatch/calculations";

const AIRPORT_DICT: Record<string, any> = {
  VOBL: { icao: "VOBL", name: "Kempegowda", latitude: 13.1979, longitude: 77.7063 },
  VABB: { icao: "VABB", name: "Chhatrapati Shivaji", latitude: 19.0887, longitude: 72.8679 },
  EGLL: { icao: "EGLL", name: "Heathrow", latitude: 51.4706, longitude: -0.461941 },
  KJFK: { icao: "KJFK", name: "JFK", latitude: 40.6398, longitude: -73.7789 }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depIcao: rawDep, arrIcao: rawArr, aircraftId: rawAcId, payloadKg: rawPayload } = body;

    const depIcao = rawDep?.toUpperCase()?.trim();
    const arrIcao = rawArr?.toUpperCase()?.trim();
    const payloadKg = parseFloat(rawPayload || "0");

    if (!depIcao || !arrIcao || !rawAcId) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // SELF-HEALING AIRPORTS: If missing, inject into database on the fly!
    async function getOrInjectAirport(icao: string) {
      let { data } = await supabase.from("airports").select("*").eq("icao", icao).maybeSingle();
      if (!data && AIRPORT_DICT[icao]) {
        const { data: newData } = await supabase.from("airports").insert(AIRPORT_DICT[icao]).select("*").single();
        data = newData;
      }
      return data;
    }

    const depAirport = await getOrInjectAirport(depIcao);
    const arrAirport = await getOrInjectAirport(arrIcao);

    if (!depAirport) return NextResponse.json({ error: `Departure ${depIcao} not found in database.` }, { status: 400 });
    if (!arrAirport) return NextResponse.json({ error: `Arrival ${arrIcao} not found in database.` }, { status: 400 });

    // SELF-HEALING AIRCRAFT: Ensure at least one aircraft exists
    let validAircraftId = rawAcId;
    if (rawAcId.startsWith("fallback-")) {
      const { data: firstAc } = await supabase.from("aircraft").select("*").limit(1).single();
      if (firstAc) {
         validAircraftId = firstAc.id;
      } else {
         const { data: injectedAc } = await supabase.from("aircraft").insert({
            model: "Boeing 777-300ER", type_code: "B77W", cruise_speed_kts: 488, fuel_burn_kg_hr: 7500,
            empty_weight_kg: 167829, max_payload_kg: 69853, max_fuel_kg: 145538, max_tow_kg: 351533
         }).select("*").single();
         if (injectedAc) validAircraftId = injectedAc.id;
         else return NextResponse.json({ error: "Database has no aircraft." }, { status: 500 });
      }
    }

    const { data: acStats } = await supabase.from("aircraft").select("*").eq("id", validAircraftId).single();

    const calculations = calculateFlightPlan({
      depLat: depAirport.latitude, depLon: depAirport.longitude, arrLat: arrAirport.latitude, arrLon: arrAirport.longitude,
      cruiseSpeedKts: acStats.cruise_speed_kts, fuelBurnKgHr: acStats.fuel_burn_kg_hr,
      emptyWeightKg: acStats.empty_weight_kg, maxPayloadKg: acStats.max_payload_kg,
      maxFuelKg: acStats.max_fuel_kg, maxTowKg: acStats.max_tow_kg, payloadKg,
    });

    const { data: newDispatch, error: insertError } = await supabase
      .from("dispatches")
      .insert({
        dep_icao: depAirport.icao, arr_icao: arrAirport.icao, aircraft_id: validAircraftId,
        distance_nm: calculations.distanceNm, cruise_altitude: calculations.cruiseAltitudeFt,
        block_time_hours: calculations.blockTimeHours, trip_fuel_kg: calculations.tripFuelKg,
        reserve_fuel_kg: calculations.reserveFuelKg, total_fuel_kg: calculations.totalFuelKg,
        tow_kg: calculations.towKg, payload_kg: payloadKg, route: "DCT", status: "PLANNED",
      })
      .select("id")
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    return NextResponse.json({ redirectUrl: `/dispatch/${newDispatch.id}` });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
