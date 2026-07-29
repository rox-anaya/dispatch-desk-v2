import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Route-protection rules live here, in one place, rather than scattered
// as checks inside individual pages. Easier to audit "what's protected"
// by reading this one file as the project grows.
const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/airline"];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

    const path = request.nextUrl.pathname;
      const isProtected = PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));

        if (isProtected && !user) {
            const redirectUrl = new URL("/login", request.url);
                redirectUrl.searchParams.set("redirectTo", path);
                    return NextResponse.redirect(redirectUrl);
                      }

                        return response;
                        }

                        export const config = {
                          matcher: [
                              /*
                                   * Run on all paths except static assets, so session stays fresh
                                        * everywhere, while keeping the matcher cheap.
                                             */
                                                 "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
                                                   ],
                                                   };
                                                   