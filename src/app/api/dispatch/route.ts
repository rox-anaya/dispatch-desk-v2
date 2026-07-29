import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateFlightPlan } from "@/lib/dispatch/calculations";

const AIRPORT_DICT: Record<string, any> = {
  VOBL: { icao: "VOBL", name: "Kempegowda", latitude: 13.1979, longitude: 77.7063, elevation_ft: 3000, iata_code: "BLR", country: "India" },
  VABB: { icao: "VABB", name: "Chhatrapati Shivaji", latitude: 19.0887, longitude: 72.8679, elevation_ft: 39, iata_code: "BOM", country: "India" },
  EGLL: { icao: "EGLL", name: "Heathrow", latitude: 51.4706, longitude: -0.461941, elevation_ft: 83, iata_code: "LHR", country: "UK" },
  KJFK: { icao: "KJFK", name: "JFK", latitude: 40.6398, longitude: -73.7789, elevation_ft: 13, iata_code: "JFK", country: "USA" }
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

    // SELF-HEALING AIRPORTS: With strict error reporting
    async function getOrInjectAirport(icao: string) {
      let { data } = await supabase.from("airports").select("*").eq("icao", icao).maybeSingle();
      if (!data && AIRPORT_DICT[icao]) {
        const { data: newData, error } = await supabase.from("airports").insert(AIRPORT_DICT[icao]).select("*").single();
        if (error) throw new Error(`Supabase blocked inserting ${icao}: ${error.message}`);
        data = newData;
      }
      return data;
    }

    const depAirport = await getOrInjectAirport(depIcao);
    const arrAirport = await getOrInjectAirport(arrIcao);

    if (!depAirport) return NextResponse.json({ error: `Departure ${depIcao} not found.` }, { status: 400 });
    if (!arrAirport) return NextResponse.json({ error: `Arrival ${arrIcao} not found.` }, { status: 400 });

    // SELF-HEALING AIRCRAFT: With strict error reporting
    let validAircraftId = rawAcId;
    if (rawAcId.startsWith("fallback-")) {
      const { data: firstAc } = await supabase.from("aircraft").select("*").limit(1).single();
      if (firstAc) {
         validAircraftId = firstAc.id;
      } else {
         const { data: injectedAc, error: acErr } = await supabase.from("aircraft").insert({
            model: "Boeing 737-800", type_code: "B738", cruise_speed_kts: 453, fuel_burn_kg_hr: 2500,
            empty_weight_kg: 41413, max_payload_kg: 20540, max_fuel_kg: 20896, max_tow_kg: 79015
         }).select("*").single();
         if (acErr) throw new Error(`Supabase blocked inserting Aircraft: ${acErr.message}`);
         validAircraftId = injectedAc.id;
      }
    }

    const { data: acStats, error: statErr } = await supabase.from("aircraft").select("*").eq("id", validAircraftId).single();
    if (statErr) throw new Error(`Could not find aircraft stats: ${statErr.message}`);

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

    if (insertError) throw new Error(`Supabase blocked saving Dispatch: ${insertError.message}`);
    return NextResponse.json({ redirectUrl: `/dispatch/${newDispatch.id}` });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
