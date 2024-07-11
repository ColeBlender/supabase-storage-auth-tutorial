import { User, DBUser } from "@/lib/types";
import { createSupabaseClient } from "../server";

export function getAuth() {
  const { auth } = createSupabaseClient();
  return auth;
}

export const getUser = async () => {
  const supabase = createSupabaseClient();
  const auth = supabase.auth;

  const authUser = (await auth.getUser()).data.user;
  if (!authUser) return null;

  // fetch user from database
  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!dbUser) return null;

  const user: User = {
    ...authUser,
    ...dbUser,
  };

  return user;
};
