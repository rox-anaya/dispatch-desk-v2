import { createAdminClient } from "@/lib/supabase/admin";

export async function getAirportByIcao(icao: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("airports")
    .select("*")
    .eq("icao", icao.toUpperCase())
    .single();

  if (error || !data) return null;
  return data;
}

export async function getAircraftById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("aircraft")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getAllAircraft() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("aircraft")
    .select("*")
    .order("model", { ascending: true });

  return data || [];
}
