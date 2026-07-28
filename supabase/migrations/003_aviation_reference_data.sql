-- Module 2: Migration 3
-- Reference/static aviation data. This is shared, read-heavy data — not
-- owned by any single pilot or airline. Populated later via a data import
-- job (planned for Module 4), not by end users.

create table public.airports (
  id uuid primary key default gen_random_uuid(),
    icao text unique not null,
      iata text,
        name text not null,
          city text,
            country text,
              latitude double precision not null,
                longitude double precision not null,
                  elevation_ft integer,
                    created_at timestamptz not null default now()
                    );

                    create table public.runways (
                      id uuid primary key default gen_random_uuid(),
                        airport_id uuid not null references public.airports(id) on delete cascade,
                          ident text not null,
                            length_ft integer,
                              width_ft integer,
                                surface text,
                                  heading_deg numeric
                                  );

                                  create table public.aircraft (
                                    id uuid primary key default gen_random_uuid(),
                                      icao_type text unique not null,
                                        name text not null,
                                          manufacturer text,
                                            max_fuel_kg numeric not null,
                                              max_payload_kg numeric not null,
                                                typical_cruise_speed_kt integer,
                                                  typical_cruise_altitude_ft integer,
                                                    fuel_burn_kg_per_hr numeric,
                                                      created_at timestamptz not null default now()
                                                      );

                                                      create table public.navaids (
                                                        id uuid primary key default gen_random_uuid(),
                                                          ident text not null,
                                                            type text not null check (type in ('waypoint', 'vor', 'ndb', 'dme')),
                                                              latitude double precision not null,
                                                                longitude double precision not null
                                                                );

                                                                create table public.airways (
                                                                  id uuid primary key default gen_random_uuid(),
                                                                    ident text unique not null
                                                                    );

                                                                    -- Ordered waypoints belonging to an airway
                                                                    create table public.airway_waypoints (
                                                                      id uuid primary key default gen_random_uuid(),
                                                                        airway_id uuid not null references public.airways(id) on delete cascade,
                                                                          navaid_id uuid not null references public.navaids(id),
                                                                            sequence_order integer not null
                                                                            );

                                                                            create table public.procedures (
                                                                              id uuid primary key default gen_random_uuid(),
                                                                                airport_id uuid not null references public.airports(id) on delete cascade,
                                                                                  ident text not null,
                                                                                    type text not null check (type in ('SID', 'STAR')),
                                                                                      runway text
                                                                                      );

                                                                                      create table public.procedure_waypoints (
                                                                                        id uuid primary key default gen_random_uuid(),
                                                                                          procedure_id uuid not null references public.procedures(id) on delete cascade,
                                                                                            navaid_id uuid not null references public.navaids(id),
                                                                                              sequence_order integer not null
                                                                                              );

                                                                                              create index idx_airports_icao on public.airports(icao);
                                                                                              create index idx_aircraft_icao_type on public.aircraft(icao_type);
                                                                                              create index idx_navaids_ident on public.navaids(ident);
                                                                                              