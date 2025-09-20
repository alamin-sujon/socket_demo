// redux/slice/messageSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MessagesState {
  chats: Record<string, Message[]>; // key: friendId
}

const initialState: MessagesState = {
  chats: {},
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { friendId, message } = action.payload;
      if (!state.chats[friendId]) state.chats[friendId] = [];
      state.chats[friendId].push(message);
    },
    setMessages: (state, action) => {
      state.chats[action.payload.friendId] = action.payload.messages;
    },
    markMessageAsRead: (state, action) => {
      const messages = state.chats[action.payload.friendId];
      if (!messages) return;
      const msg = messages.find((m) => m._id === action.payload.messageId);
      if (msg) msg.isRead = true;
    },
  },
});

export const selectMessage = (state: RootState) => state.messages;

export const { addMessage, setMessages, markMessageAsRead } =
  messagesSlice.actions;
export default messagesSlice.reducer;
