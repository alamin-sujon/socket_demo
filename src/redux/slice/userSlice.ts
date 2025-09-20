// store/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface IUserState {
  _id: string;
  role: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isProfileUpdate: boolean;
  isResettingPassword: boolean;
  emailVerificationCode?: string;
  emailVerificationExpires?: string;
  forgetPasswordCode?: string;
  forgetPasswordExpires?: string;
  lastLoggedin?: string;
  passwordChangeTime?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UserSliceState {
  user: IUserState | null;
  accessToken: string;
}

const initialState: UserSliceState = {
  user: null,
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectToken = (state: RootState) => state.user.accessToken;

export default userSlice.reducer;
