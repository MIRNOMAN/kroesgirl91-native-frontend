import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define allowed roles
export type UserRole =
   "USER"


type AuthState = {
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  role: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ role: UserRole; accessToken: string }>,
    ) => {
      const { role, accessToken } = action.payload;

      state.role = role;
      state.token = accessToken;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRole = (state: RootState) => state.auth.role;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
