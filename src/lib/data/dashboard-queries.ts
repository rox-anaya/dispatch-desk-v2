import { createClient } from "@/lib/supabase/client";

export async function getPilotStats() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("dispatches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return {
      totalFlights: 0,
      totalDistance: 0,
      totalHours: 0,
      totalFuel: 0,
      recentDispatches: [],
    };
  }

  const totalFlights = data.length;
  const totalDistance = data.reduce((acc, curr) => acc + (curr.distance_nm || 0), 0);
  const totalHours = data.reduce((acc, curr) => acc + (curr.block_time_hours || 0), 0);
  const totalFuel = data.reduce((acc, curr) => acc + (curr.total_fuel_kg || 0), 0);

  return {
    totalFlights,
    totalDistance,
    totalHours: Number(totalHours.toFixed(1)),
    totalFuel,
    recentDispatches: data.slice(0, 5), // Top 5 recent
  };
}
