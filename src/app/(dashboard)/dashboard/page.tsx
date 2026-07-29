import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { signOut } from "@/lib/auth/actions";
import RequireRole from "@/components/auth/RequireRole";

// This page is under the (dashboard) route group and matches the
// "/dashboard" prefix that middleware.ts protects — if there's no
// session, the middleware redirects to /login before this ever renders.
export default async function DashboardPage() {
  const profile = await getCurrentProfile();

    return (
        <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
              <div className="mx-auto max-w-2xl">
                      <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-semibold">
                                            Welcome, {profile?.full_name ?? "Pilot"}
                                                      </h1>
                                                                <form action={signOut}>
                                                                            <button className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
                                                                                          Sign out
                                                                                                      </button>
                                                                                                                </form>
                                                                                                                        </div>

                                                                                                                                <p className="text-white/50">Role: {profile?.role}</p>

                                                                                                                                        <RequireRole allowed={["system_admin"]}>
                                                                                                                                                  <div className="mt-6 rounded-lg border border-sky-500/30 bg-sky-500/10 p-4">
                                                                                                                                                              System admin tools would appear here.
                                                                                                                                                                        </div>
                                                                                                                                                                                </RequireRole>

                                                                                                                                                                                        <RequireRole allowed={["airline_admin", "system_admin"]}>
                                                                                                                                                                                                  <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
                                                                                                                                                                                                              Airline management tools would appear here.
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                </RequireRole>
                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            