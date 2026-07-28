-- Module 2: Migration 5
-- Enable RLS on every table. Default-deny: nothing is accessible until a
-- policy explicitly allows it. This is the safety net for a public,
-- multi-tenant platform — one bug in app code can't expose another
-- pilot's or airline's private data if the database itself enforces it.

alter table public.profiles enable row level security;
alter table public.airlines enable row level security;
alter table public.airline_members enable row level security;
alter table public.airports enable row level security;
alter table public.runways enable row level security;
alter table public.aircraft enable row level security;
alter table public.navaids enable row level security;
alter table public.airways enable row level security;
alter table public.airway_waypoints enable row level security;
alter table public.procedures enable row level security;
alter table public.procedure_waypoints enable row level security;
alter table public.dispatches enable row level security;
alter table public.flight_history enable row level security;

-- Helper: is the current user a system_admin?
create or replace function public.is_system_admin()
returns boolean as $$
  select exists (
      select 1 from public.profiles
          where id = auth.uid() and role = 'system_admin'
            );
            $$ language sql security definer stable;

            -- Helper: is the current user an admin of a given airline?
            create or replace function public.is_airline_admin(target_airline_id uuid)
            returns boolean as $$
              select exists (
                  select 1 from public.airline_members
                      where airline_id = target_airline_id
                            and pilot_id = auth.uid()
                                  and role = 'admin'
                                    );
                                    $$ language sql security definer stable;

                                    -- PROFILES: publicly readable (community platform — pilots see each other's
                                    -- basic profile), but only the owner or a system admin can modify.
                                    create policy "profiles are publicly readable"
                                      on public.profiles for select using (true);

                                      create policy "users can update own profile"
                                        on public.profiles for update using (auth.uid() = id);

                                        -- AIRLINES: publicly readable; only owner or system admin can modify.
                                        create policy "airlines are publicly readable"
                                          on public.airlines for select using (true);

                                          create policy "owner or system admin manages airline"
                                            on public.airlines for all
                                              using (auth.uid() = owner_id or public.is_system_admin());

                                              -- AIRLINE_MEMBERS: members can see their own airline's roster; pilots can
                                              -- see which airlines they belong to.
                                              create policy "view own memberships or fellow airline members"
                                                on public.airline_members for select
                                                  using (
                                                      pilot_id = auth.uid()
                                                          or airline_id in (select airline_id from public.airline_members where pilot_id = auth.uid())
                                                            );

                                                            create policy "airline admins manage membership"
                                                              on public.airline_members for all
                                                                using (public.is_airline_admin(airline_id) or public.is_system_admin());

                                                                -- AVIATION REFERENCE DATA: public read-only; only system admins write.
                                                                -- (Applies the same pattern across airports, runways, aircraft, navaids,
                                                                -- airways, airway_waypoints, procedures, procedure_waypoints.)
                                                                create policy "reference data publicly readable" on public.airports for select using (true);
                                                                create policy "system admin manages airports" on public.airports for all using (public.is_system_admin());

                                                                create policy "reference data publicly readable" on public.runways for select using (true);
                                                                create policy "system admin manages runways" on public.runways for all using (public.is_system_admin());

                                                                create policy "reference data publicly readable" on public.aircraft for select using (true);
                                                                create policy "system admin manages aircraft" on public.aircraft for all using (public.is_system_admin());

                                                                create policy "reference data publicly readable" on public.navaids for select using (true);
                                                                create policy "system admin manages navaids" on public.navaids for all using (public.is_system_admin());

                                                                create policy "reference data publicly readable" on public.airways for select using (true);
                                                                create policy "system admin manages airways" on public.airways for all using (public.is_system_admin());

                                                                create policy "reference data publicly readable" on public.airway_waypoints for select using (true);
                                                                create policy "system admin manages airway_waypoints" on public.airway_waypoints for all using (public.is_system_admin());

                                                                create policy "reference data publicly readable" on public.procedures for select using (true);
                                                                create policy "system admin manages procedures" on public.procedures for all using (public.is_system_admin());

                                                                create policy "reference data publicly readable" on public.procedure_waypoints for select using (true);
                                                                create policy "system admin manages procedure_waypoints" on public.procedure_waypoints for all using (public.is_system_admin());

                                                                -- DISPATCHES: a pilot fully controls their own dispatches. Airline admins
                                                                -- can view (not edit) dispatches filed under their airline. System admin
                                                                -- sees everything.
                                                                create policy "pilot manages own dispatches"
                                                                  on public.dispatches for all
                                                                    using (pilot_id = auth.uid());

                                                                    create policy "airline admin views airline dispatches"
                                                                      on public.dispatches for select
                                                                        using (
                                                                            (airline_id is not null and public.is_airline_admin(airline_id))
                                                                                or public.is_system_admin()
                                                                                  );

                                                                                  -- FLIGHT_HISTORY: same shape as dispatches.
                                                                                  create policy "pilot manages own flight history"
                                                                                    on public.flight_history for all
                                                                                      using (pilot_id = auth.uid());

                                                                                      create policy "system admin views all flight history"
                                                                                        on public.flight_history for select
                                                                                          using (public.is_system_admin());
                                                                                          