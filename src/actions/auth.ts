"use server";

import { getAuth } from "@/supabase/auth/server";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const auth = getAuth();

    const { error } = await auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: "Something went wrong" };
  }
}

export async function signOutAction() {
  try {
    const auth = getAuth();

    const { error } = await auth.signOut();

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: "Something went wrong" };
  }
}
