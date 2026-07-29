import { MetarResponse, TafResponse } from "./types";

export async function getMetar(icao: string): Promise<MetarResponse | null> {
  try {
    const res = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch (err) {
    console.error(`Failed to fetch METAR for ${icao}`, err);
    return null;
  }
}

export async function getTaf(icao: string): Promise<TafResponse | null> {
  try {
    const res = await fetch(`https://aviationweather.gov/api/data/taf?ids=${icao}&format=json`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch (err) {
    console.error(`Failed to fetch TAF for ${icao}`, err);
    return null;
  }
}
