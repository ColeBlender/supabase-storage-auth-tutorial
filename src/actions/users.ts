"use server";

import { getUser } from "@/supabase/auth/server";
import { createSupabaseClient } from "@/supabase/server";

export async function updateUserAvatarAction(avatarUrl: string | null) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to update avatar");

    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: "Something went wrong" };
  }
}
