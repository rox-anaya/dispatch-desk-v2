-- Module 2: Migration 2
-- Airlines are independent tenants on the platform. A pilot can belong to
-- multiple airlines (airline_members is many-to-many), matching how real
-- Infinite Flight pilots often fly for more than one VA.

create type public.airline_member_role as enum ('member', 'admin');

create table public.airlines (
  id uuid primary key default gen_random_uuid(),
    name text not null,
      icao_code text unique not null,
        iata_code text,
          description text,
            logo_url text,
              theme_color text default '#0B0F14',
                owner_id uuid not null references public.profiles(id),
                  created_at timestamptz not null default now(),
                    updated_at timestamptz not null default now()
                    );

                    create trigger trg_airlines_updated_at
                      before update on public.airlines
                        for each row execute function public.set_updated_at();

                        create table public.airline_members (
                          id uuid primary key default gen_random_uuid(),
                            airline_id uuid not null references public.airlines(id) on delete cascade,
                              pilot_id uuid not null references public.profiles(id) on delete cascade,
                                role public.airline_member_role not null default 'member',
                                  joined_at timestamptz not null default now(),
                                    unique (airline_id, pilot_id)
                                    );

                                    comment on table public.airline_members is 'Join table linking pilots to airlines with a per-airline role, separate from the global profiles.role.';
                                    