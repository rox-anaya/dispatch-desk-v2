// Shared types matching the Module 2 database schema.
// Once the project is fully wired up, these can be replaced/supplemented by
// running `supabase gen types typescript` for full auto-sync with the DB.

export type UserRole = "pilot" | "airline_admin" | "system_admin";
export type AirlineMemberRole = "member" | "admin";
export type DispatchStatus = "draft" | "filed" | "completed" | "cancelled";

export interface Profile {
  id: string;
    callsign: string | null;
      full_name: string;
        ifc_username: string | null;
          role: UserRole;
            avatar_url: string | null;
              bio: string | null;
                created_at: string;
                  updated_at: string;
                  }

                  export interface Airline {
                    id: string;
                      name: string;
                        icao_code: string;
                          iata_code: string | null;
                            description: string | null;
                              logo_url: string | null;
                                theme_color: string;
                                  owner_id: string;
                                    created_at: string;
                                      updated_at: string;
                                      }

                                      export interface AirlineMember {
                                        id: string;
                                          airline_id: string;
                                            pilot_id: string;
                                              role: AirlineMemberRole;
                                                joined_at: string;
                                                }

                                                export interface Airport {
                                                  id: string;
                                                    icao: string;
                                                      iata: string | null;
                                                        name: string;
                                                          city: string | null;
                                                            country: string | null;
                                                              latitude: number;
                                                                longitude: number;
                                                                  elevation_ft: number | null;
                                                                  }

                                                                  export interface Aircraft {
                                                                    id: string;
                                                                      icao_type: string;
                                                                        name: string;
                                                                          manufacturer: string | null;
                                                                            max_fuel_kg: number;
                                                                              max_payload_kg: number;
                                                                                typical_cruise_speed_kt: number | null;
                                                                                  typical_cruise_altitude_ft: number | null;
                                                                                    fuel_burn_kg_per_hr: number | null;
                                                                                    }

                                                                                    export interface Dispatch {
                                                                                      id: string;
                                                                                        pilot_id: string;
                                                                                          airline_id: string | null;
                                                                                            aircraft_id: string;
                                                                                              departure_airport_id: string;
                                                                                                arrival_airport_id: string;
                                                                                                  alternate_airport_id: string | null;
                                                                                                    route: string | null;
                                                                                                      cruise_altitude_ft: number | null;
                                                                                                        planned_fuel_kg: number | null;
                                                                                                          payload_kg: number | null;
                                                                                                            estimated_flight_time_minutes: number | null;
                                                                                                              distance_nm: number | null;
                                                                                                                status: DispatchStatus;
                                                                                                                  created_at: string;
                                                                                                                    updated_at: string;
                                                                                                                    }

                                                                                                                    export interface FlightHistory {
                                                                                                                      id: string;
                                                                                                                        dispatch_id: string;
                                                                                                                          pilot_id: string;
                                                                                                                            actual_departure_time: string | null;
                                                                                                                              actual_arrival_time: string | null;
                                                                                                                                actual_flight_time_minutes: number | null;
                                                                                                                                  landing_rate_fpm: number | null;
                                                                                                                                    notes: string | null;
                                                                                                                                      created_at: string;
                                                                                                                                      }

                                                                                                                                      export interface PilotStatistics {
                                                                                                                                        pilot_id: string;
                                                                                                                                          total_flights: number;
                                                                                                                                            total_flight_minutes: number;
                                                                                                                                              avg_landing_rate_fpm: number;
                                                                                                                                              }
                                                                                                                                              