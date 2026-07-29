export interface CalculationParams {
  depLat: number;
  depLon: number;
  arrLat: number;
  arrLon: number;
  cruiseSpeedKts: number;
  fuelBurnKgHr: number;
  emptyWeightKg: number;
  maxPayloadKg: number;
  maxFuelKg: number;
  maxTowKg: number;
  payloadKg: number;
}

export interface CalculationResults {
  distanceNm: number;
  flightTimeHours: number;
  blockTimeHours: number;
  tripFuelKg: number;
  reserveFuelKg: number;
  totalFuelKg: number;
  towKg: number;
  cruiseAltitudeFt: number;
  warnings: string[];
}

function calculateGreatCircleDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Radius of Earth in Nautical Miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function calculateInitialHeading(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;
  return bearing;
}

export function calculateFlightPlan(params: CalculationParams): CalculationResults {
  const warnings: string[] = [];

  const distanceNm = calculateGreatCircleDistance(
    params.depLat,
    params.depLon,
    params.arrLat,
    params.arrLon
  );

  const initialHeading = calculateInitialHeading(
    params.depLat,
    params.depLon,
    params.arrLat,
    params.arrLon
  );

  // Hemispheric Cruise Altitude Selection
  // Eastbound (0 - 179 deg) -> Odd Flight Levels (FL330, FL350, FL370, FL390)
  // Westbound (180 - 359 deg) -> Even Flight Levels (FL320, FL340, FL360, FL380)
  const isEastbound = initialHeading >= 0 && initialHeading < 180;
  const cruiseAltitudeFt = isEastbound ? 35000 : 36000;

  const flightTimeHours = distanceNm / params.cruiseSpeedKts;
  const blockTimeHours = flightTimeHours + 0.4; // 24 mins taxi/climb/descent contingency

  const tripFuelKg = flightTimeHours * params.fuelBurnKgHr;
  const reserveFuelKg = 45 * (params.fuelBurnKgHr / 60); // 45 min statutory IFR reserve
  const totalFuelKg = Math.round(tripFuelKg + reserveFuelKg);

  if (params.payloadKg > params.maxPayloadKg) {
    warnings.push(`Payload (${params.payloadKg} kg) exceeds Max Payload (${params.maxPayloadKg} kg).`);
  }

  if (totalFuelKg > params.maxFuelKg) {
    warnings.push(`Required Fuel (${totalFuelKg} kg) exceeds Max Fuel Capacity (${params.maxFuelKg} kg).`);
  }

  const towKg = params.emptyWeightKg + params.payloadKg + totalFuelKg;

  if (towKg > params.maxTowKg) {
    warnings.push(`Takeoff Weight (${towKg} kg) exceeds MTOW (${params.maxTowKg} kg).`);
  }

  return {
    distanceNm,
    flightTimeHours: parseFloat(flightTimeHours.toFixed(2)),
    blockTimeHours: parseFloat(blockTimeHours.toFixed(2)),
    tripFuelKg: Math.round(tripFuelKg),
    reserveFuelKg: Math.round(reserveFuelKg),
    totalFuelKg,
    towKg,
    cruiseAltitudeFt,
    warnings,
  };
}
