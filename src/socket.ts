// socket.ts (frontend)
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});

// Register user after login
export const registerUser = (userId: string) => {
  socket.emit("register", userId);
};
