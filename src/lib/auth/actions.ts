"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Using Next.js Server Actions (not client-side fetch to an API route) so
// auth tokens/cookies are set directly by the server response — avoids a
// whole class of bugs around cookies not syncing between client and server.

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
    const password = formData.get("password") as string;
      const fullName = formData.get("fullName") as string;

        const supabase = await createClient();

          const { error } = await supabase.auth.signUp({
              email,
                  password,
                      options: {
                            data: { full_name: fullName },
                                  emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                                      },
                                        });

                                          if (error) {
                                              return { error: error.message };
                                                }

                                                  return { success: true, message: "Check your email to confirm your account." };
                                                  }

                                                  export async function signIn(formData: FormData) {
                                                    const email = formData.get("email") as string;
                                                      const password = formData.get("password") as string;
                                                        const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

                                                          const supabase = await createClient();

                                                            const { error } = await supabase.auth.signInWithPassword({ email, password });

                                                              if (error) {
                                                                  return { error: error.message };
                                                                    }

                                                                      revalidatePath("/", "layout");
                                                                        redirect(redirectTo);
                                                                        }

                                                                        export async function signOut() {
                                                                          const supabase = await createClient();
                                                                            await supabase.auth.signOut();
                                                                              revalidatePath("/", "layout");
                                                                                redirect("/login");
                                                                                }
                                                                                