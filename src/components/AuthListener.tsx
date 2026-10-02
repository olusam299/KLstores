import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAppDispatch } from "../hooks";
import { setAuthUser } from "../features/auth/authSlice";
import type { Session } from "@supabase/supabase-js";

const syncSession = async (
  session: Session | null,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  if (!session?.user) {
    dispatch(setAuthUser(null));
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .maybeSingle();

  dispatch(
    setAuthUser({
      userId: session.user.id,
      email: session.user.email ?? "",
      fullName: (session.user.user_metadata?.full_name as string) ?? null,
      isAdmin: profile?.is_admin ?? false,
    })
  );
};

// Mounted once at the root of the app (see HomeLayout). Keeps Redux's
// `auth` slice in sync with Supabase's real session, including whether
// this user is an admin.
const AuthListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session, dispatch);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session, dispatch);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
};

export default AuthListener;
