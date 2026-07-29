import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase sends users here after they click the email confirmation link.
// We exchange the one-time code for a real session, then send them on.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
      const next = searchParams.get("next") ?? "/dashboard";

        if (code) {
            const supabase = await createClient();
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (!error) {
                          return NextResponse.redirect(`${origin}${next}`);
                              }
                                }

                                  return NextResponse.redirect(`${origin}/login?error=Could not confirm account`);
                                  }
                                  