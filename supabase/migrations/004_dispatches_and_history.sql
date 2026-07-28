-- Module 2: Migration 4
-- Dispatches are the core user-generated data: a flight plan a pilot creates.
-- flight_history records what actually happened once a dispatch is flown.
-- Kept as separate tables (rather than one) because a dispatch can exist
-- without ever being flown, and a flown flight has different fields
-- (actual times, landing rate) that don't apply to a planned dispatch.

create type public.dispatch_status as enum ('draft', 'filed', 'completed', 'cancelled');

create table public.dispatches (
  id uuid primary key default gen_random_uuid(),
    pilot_id uuid not null references public.profiles(id) on delete cascade,
      airline_id uuid references public.airlines(id) on delete set null,
        aircraft_id uuid not null references public.aircraft(id),
          departure_airport_id uuid not null references public.airports(id),
            arrival_airport_id uuid not null references public.airports(id),
              alternate_airport_id uuid references public.airports(id),
                route text,
                  cruise_altitude_ft integer,
                    planned_fuel_kg numeric,
                      payload_kg numeric,
                        estimated_flight_time_minutes integer,
                          distance_nm numeric,
                            status public.dispatch_status not null default 'draft',
                              created_at timestamptz not null default now(),
                                updated_at timestamptz not null default now()
                                );

                                create trigger trg_dispatches_updated_at
                                  before update on public.dispatches
                                    for each row execute function public.set_updated_at();

                                    create table public.flight_history (
                                      id uuid primary key default gen_random_uuid(),
                                        dispatch_id uuid not null references public.dispatches(id) on delete cascade,
                                          pilot_id uuid not null references public.profiles(id) on delete cascade,
                                            actual_departure_time timestamptz,
                                              actual_arrival_time timestamptz,
                                                actual_flight_time_minutes integer,
                                                  landing_rate_fpm integer,
                                                    notes text,
                                                      created_at timestamptz not null default now()
                                                      );

                                                      create index idx_dispatches_pilot on public.dispatches(pilot_id);
                                                      create index idx_dispatches_airline on public.dispatches(airline_id);
                                                      create index idx_flight_history_pilot on public.flight_history(pilot_id);

                                                      -- Statistics are intentionally NOT a stored table — they're a view computed
                                                      -- from flight_history, so numbers are always accurate and never go stale.
                                                      create view public.pilot_statistics as
                                                      select
                                                        pilot_id,
                                                          count(*) as total_flights,
                                                            coalesce(sum(actual_flight_time_minutes), 0) as total_flight_minutes,
                                                              coalesce(avg(landing_rate_fpm), 0) as avg_landing_rate_fpm
                                                              from public.flight_history
                                                              group by pilot_id;
                                                              