import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

// Central place to fetch "who is logged in and what's their role" — every
// server component/action that needs role-aware behavior calls this instead
// of re-writing the same two queries everywhere.
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();

    const {
        data: { user },
          } = await supabase.auth.getUser();

            if (!user) return null;

              const { data: profile } = await supabase
                  .from("profiles")
                      .select("*")
                          .eq("id", user.id)
                              .single();

                                return profile as Profile | null;
                                }

                                // Checks a pilot's role within one specific airline (distinct from the
                                // global profiles.role — see Module 2 notes on why these are separate).
                                export async function getAirlineRole(
                                  airlineId: string
                                  ): Promise<"member" | "admin" | null> {
                                    const supabase = await createClient();

                                      const {
                                          data: { user },
                                            } = await supabase.auth.getUser();

                                              if (!user) return null;

                                                const { data } = await supabase
                                                    .from("airline_members")
                                                        .select("role")
                                                            .eq("airline_id", airlineId)
                                                                .eq("pilot_id", user.id)
                                                                    .single();

                                                                      return (data?.role as "member" | "admin") ?? null;
                                                                      }
                                                                      