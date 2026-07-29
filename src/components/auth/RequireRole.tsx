import { ReactNode } from "react";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type { UserRole } from "@/types/database";

interface RequireRoleProps {
  allowed: UserRole[];
    children: ReactNode;
      fallback?: ReactNode;
      }

      // Server component (not client-side) by design: role checks that only run
      // in the browser can be bypassed by disabling JS or editing client state.
      // This runs during server render, so gated content is never even sent to
      // an unauthorized user's browser.
      export default async function RequireRole({
        allowed,
          children,
            fallback = null,
            }: RequireRoleProps) {
              const profile = await getCurrentProfile();

                if (!profile || !allowed.includes(profile.role)) {
                    return <>{fallback}</>;
                      }

                        return <>{children}</>;
                        }
                        