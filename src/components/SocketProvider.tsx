// App.tsx or Layout.tsx
import { useEffect } from "react";
import { socket } from "../socket";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slice/userSlice";
import { addNotification } from "../redux/slice/notificationSlice";
import { addMessage } from "../redux/slice/messageSlice";
import toast from "react-hot-toast";

export const SocketProvider = () => {
  const user = useAppSelector(selectUser);
  const userId = user?._id;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userId) return;

    // Register user on socket
    socket.emit("register", userId);
    console.log("Registered socket:", userId);

    // Listen for notifications
    socket.on("receive_notification", (notif) => {
      console.log("New notification:", notif);
      toast.success(notif?.content);
      dispatch(addNotification(notif));
      // Optionally show toast here
    });

    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      console.log("New message:", msg);
      toast.success(msg?.text);
      const friendId = msg.sender; // assuming current user is receiver
      dispatch(addMessage({ friendId, message: msg }));
    });

    return () => {
      socket.off("receive_notification");
      socket.off("receive_message");
    };
  }, [userId, dispatch]);

  return null; // this component doesn't render anything
};
