import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateFlightPlan } from "@/lib/dispatch/calculations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depIcao: rawDep, arrIcao: rawArr, aircraftId: rawAcId, payloadKg: rawPayload } = body;

    const depIcao = rawDep?.toUpperCase()?.trim();
    const arrIcao = rawArr?.toUpperCase()?.trim();
    const payloadKg = parseFloat(rawPayload || "0");

    if (!depIcao || !arrIcao || !rawAcId) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Lookup Airports strictly from DB
    const { data: depAirport } = await supabase.from("airports").select("*").eq("icao", depIcao).maybeSingle();
    const { data: arrAirport } = await supabase.from("airports").select("*").eq("icao", arrIcao).maybeSingle();

    if (!depAirport) return NextResponse.json({ error: `Departure ${depIcao} not found in database.` }, { status: 400 });
    if (!arrAirport) return NextResponse.json({ error: `Arrival ${arrIcao} not found in database.` }, { status: 400 });

    // Lookup Aircraft
    let validAircraftId = rawAcId;
    if (rawAcId.startsWith("fallback-")) {
      const typeCode = rawAcId.split("-")[1].toUpperCase();
      const { data: acDb } = await supabase.from("aircraft").select("*").eq("type_code", typeCode).maybeSingle();
      if (acDb) validAircraftId = acDb.id;
      else {
        const { data: anyAc } = await supabase.from("aircraft").select("*").limit(1).single();
        if (anyAc) validAircraftId = anyAc.id;
        else return NextResponse.json({ error: "No aircraft found in database. Run seed script." }, { status: 500 });
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
