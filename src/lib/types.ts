import { User as SupabaseUser } from "@supabase/supabase-js";

export type DBUser = {
  id: string;
  avatar_url: string;
};

export type User = SupabaseUser & DBUser;
