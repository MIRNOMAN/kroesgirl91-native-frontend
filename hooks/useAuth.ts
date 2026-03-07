import { useCallback } from "react";

import { logout, setUser, UserRole } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

type SignInPayload = {
  role: UserRole;
  accessToken: string;
};

export function useAuth() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.role);
  const token = useAppSelector((state) => state.auth.token);

  const signIn = useCallback(
    (payload: SignInPayload) => {
      dispatch(setUser(payload));
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated,
    role,
    token,
    signIn,
    signOut,
  };
}
