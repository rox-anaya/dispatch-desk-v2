import { createAdminClient } from "@/lib/supabase/admin";

export async function getDispatchById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("dispatches")
    .select(`
      *,
      aircraft:aircraft_id (*)
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getRecentDispatches() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("dispatches")
    .select(`
      *,
      aircraft:aircraft_id (model)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  return data || [];
}
