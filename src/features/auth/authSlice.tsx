import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  userId: string;
  email: string;
  fullName: string | null;
};

type AuthState = {
  loginStatus: boolean;
  userId: string | null;
  email: string | null;
  fullName: string | null;
};

const initialState: AuthState = {
  loginStatus: false,
  userId: null,
  email: null,
  fullName: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called by AuthListener whenever Supabase's auth state changes
    // (sign in, sign out, session restored on page load, etc).
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      if (action.payload) {
        state.loginStatus = true;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.fullName = action.payload.fullName;
      } else {
        state.loginStatus = false;
        state.userId = null;
        state.email = null;
        state.fullName = null;
      }
    },
  },
});

export const { setAuthUser } = authSlice.actions;

export default authSlice.reducer;
