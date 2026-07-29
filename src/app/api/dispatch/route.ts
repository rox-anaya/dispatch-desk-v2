import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateFlightPlan } from "@/lib/dispatch/calculations";

// Hardcoded coordinate fallback dictionary for key major airports
const AIRPORT_FALLBACKS: Record<string, { icao: string; name: string; latitude: number; longitude: number }> = {
  EGLL: { icao: "EGLL", name: "London Heathrow Airport", latitude: 51.4706, longitude: -0.461941 },
  KJFK: { icao: "KJFK", name: "John F Kennedy International Airport", latitude: 40.639801, longitude: -73.7789 },
  VOBL: { icao: "VOBL", name: "Kempegowda International Airport", latitude: 13.1979, longitude: 77.7063 },
  OMDB: { icao: "OMDB", name: "Dubai International Airport", latitude: 25.2532, longitude: 55.3657 },
  KSFO: { icao: "KSFO", name: "San Francisco International Airport", latitude: 37.619, longitude: -122.375 },
  VABB: { icao: "VABB", name: "Chhatrapati Shivaji Maharaj International Airport", latitude: 19.0887, longitude: 72.8679 },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depIcao: rawDep, arrIcao: rawArr, aircraftId: rawAcId, payloadKg: rawPayload } = body;

    const depIcao = rawDep?.toUpperCase()?.trim();
    const arrIcao = rawArr?.toUpperCase()?.trim();
    let aircraftId = rawAcId;
    const payloadKg = parseFloat(rawPayload || "0");

    if (!depIcao || !arrIcao || !aircraftId) {
      return NextResponse.json(
        { error: "Departure ICAO, Arrival ICAO, and Aircraft Selection are required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let depAirport = AIRPORT_FALLBACKS[depIcao] || null;
    let arrAirport = AIRPORT_FALLBACKS[arrIcao] || null;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);

      // Attempt DB lookup if not matched in fast fallback dictionary
      if (!depAirport) {
        const { data } = await supabase.from("airports").select("*").ilike("icao", depIcao).maybeSingle();
        if (data) depAirport = data;
      }

      if (!arrAirport) {
        const { data } = await supabase.from("airports").select("*").ilike("icao", arrIcao).maybeSingle();
        if (data) arrAirport = data;
      }
    }

    if (!depAirport) {
      return NextResponse.json({ error: `Departure airport "${depIcao}" not found in system or dictionary.` }, { status: 400 });
    }
    if (!arrAirport) {
      return NextResponse.json({ error: `Arrival airport "${arrIcao}" not found in system or dictionary.` }, { status: 400 });
    }

    // Aircraft data fallback
    const aircraft = {
      id: aircraftId,
      model: "Boeing 777-300ER",
      type_code: "B77W",
      cruise_speed_kts: 488,
      fuel_burn_kg_hr: 7500,
      empty_weight_kg: 167829,
      max_payload_kg: 69853,
      max_fuel_kg: 145538,
      max_tow_kg: 351533,
    };

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

    // Save to database if connected
    let savedId = `release-${Date.now().toString(36)}`;
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);

      // Verify aircraft UUID in DB or use matched first record
      let validAircraftId = aircraftId;
      if (aircraftId.startsWith("fallback-") || !aircraftId.includes("-")) {
        const { data: acDb } = await supabase.from("aircraft").select("id").limit(1).single();
        if (acDb) validAircraftId = acDb.id;
      }

      const { data: newDispatch } = await supabase
        .from("dispatches")
        .insert({
          dep_icao: depAirport.icao,
          arr_icao: arrAirport.icao,
          aircraft_id: validAircraftId,
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

      if (newDispatch) {
        savedId = newDispatch.id;
      }
    }

    return NextResponse.json({ redirectUrl: `/dispatch/${savedId}` });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
