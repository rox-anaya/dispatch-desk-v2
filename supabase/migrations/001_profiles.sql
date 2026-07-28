-- Module 2: Migration 1
-- Profiles extend Supabase's built-in auth.users with app-specific fields.
-- We never store custom user data directly in auth.users — it's managed by
-- Supabase Auth internally and shouldn't be extended directly.

create type public.user_role as enum ('pilot', 'airline_admin', 'system_admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
    callsign text unique,
      full_name text not null,
        ifc_username text,
          role public.user_role not null default 'pilot',
            avatar_url text,
              bio text,
                created_at timestamptz not null default now(),
                  updated_at timestamptz not null default now()
                  );

                  comment on table public.profiles is 'App-level profile data for each authenticated user, one-to-one with auth.users.';
                  comment on column public.profiles.role is 'Global platform role. Airline-specific roles are handled separately in airline_members.';

                  -- Keep updated_at fresh automatically
                  create or replace function public.set_updated_at()
                  returns trigger as $$
                  begin
                    new.updated_at = now();
                      return new;
                      end;
                      $$ language plpgsql;

                      create trigger trg_profiles_updated_at
                        before update on public.profiles
                          for each row execute function public.set_updated_at();

                          -- Auto-create a profile row whenever a new auth user signs up
                          create or replace function public.handle_new_user()
                          returns trigger as $$
                          begin
                            insert into public.profiles (id, full_name)
                              values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New Pilot'));
                                return new;
                                end;
                                $$ language plpgsql security definer;

                                create trigger trg_on_auth_user_created
                                  after insert on auth.users
                                    for each row execute function public.handle_new_user();
                                    