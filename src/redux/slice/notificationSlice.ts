// redux/slice/notificationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Notification {
  _id: string;
  receiverId: string;
  senderId?: string;
  type: "message" | "task" | "alert" | "system";
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  items: Notification[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload); // newest first
    },
    markAsRead: (state, action) => {
      const notif = state.items.find((n) => n._id === action.payload);
      if (notif) notif.isRead = true;
    },
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const selectNotification = (state: RootState) => state.notification;

export const { addNotification, markAsRead, setNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
