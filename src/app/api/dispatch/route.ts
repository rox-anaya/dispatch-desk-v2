import { NextResponse } from "next/server";
import { calculateFlightPlan } from "@/lib/dispatch/calculations";

const AIRPORT_FALLBACKS: Record<string, any> = {
  VOBL: { icao: "VOBL", name: "Kempegowda International", latitude: 13.1979, longitude: 77.7063 },
  VABB: { icao: "VABB", name: "Chhatrapati Shivaji", latitude: 19.0887, longitude: 72.8679 },
  EGLL: { icao: "EGLL", name: "Heathrow", latitude: 51.4706, longitude: -0.461941 },
  KJFK: { icao: "KJFK", name: "JFK", latitude: 40.6398, longitude: -73.7789 },
  OMDB: { icao: "OMDB", name: "Dubai International", latitude: 25.2532, longitude: 55.3657 },
  KSFO: { icao: "KSFO", name: "San Francisco", latitude: 37.619, longitude: -122.375 }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depIcao: rawDep, arrIcao: rawArr, aircraftId: rawAcId, payloadKg: rawPayload } = body;

    const depIcao = rawDep?.toUpperCase()?.trim();
    const arrIcao = rawArr?.toUpperCase()?.trim();
    const payloadKg = parseFloat(rawPayload || "0");

    if (!depIcao || !arrIcao) return NextResponse.json({ error: "Missing departure or arrival ICAO." }, { status: 400 });

    const depAirport = AIRPORT_FALLBACKS[depIcao] || { icao: depIcao, latitude: 13.0, longitude: 77.0 };
    const arrAirport = AIRPORT_FALLBACKS[arrIcao] || { icao: arrIcao, latitude: 19.0, longitude: 72.0 };

    const acStats = {
      model: rawAcId?.includes("A359") ? "Airbus A350-900" : rawAcId?.includes("B738") ? "Boeing 737-800" : "Boeing 777-300ER",
      cruise_speed_kts: 488,
      fuel_burn_kg_hr: 7500,
      empty_weight_kg: 167829,
      max_payload_kg: 69853,
      max_fuel_kg: 145538,
      max_tow_kg: 351533
    };

    const calculations = calculateFlightPlan({
      depLat: depAirport.latitude, depLon: depAirport.longitude,
      arrLat: arrAirport.latitude, arrLon: arrAirport.longitude,
      cruiseSpeedKts: acStats.cruise_speed_kts, fuelBurnKgHr: acStats.fuel_burn_kg_hr,
      emptyWeightKg: acStats.empty_weight_kg, maxPayloadKg: acStats.max_payload_kg,
      maxFuelKg: acStats.max_fuel_kg, maxTowKg: acStats.max_tow_kg, payloadKg,
    });

    const params = new URLSearchParams({
      dep: depIcao,
      arr: arrIcao,
      model: acStats.model,
      dist: calculations.distanceNm.toString(),
      alt: calculations.cruiseAltitudeFt.toString(),
      time: calculations.blockTimeHours.toString(),
      fuel: calculations.totalFuelKg.toString(),
      tow: calculations.towKg.toString(),
    });

    return NextResponse.json({ redirectUrl: `/dispatch/result?${params.toString()}` });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
