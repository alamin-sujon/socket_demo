// MessagePage.tsx
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../redux/hooks";
import { selectToken, selectUser } from "../redux/slice/userSlice";
import { useGetAllDriverQuery } from "../redux/api/baseApi";

export default function MessagePage() {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const user = useAppSelector(selectUser);
  const { data } = useGetAllDriverQuery(null);
  const driver = data?.data;
  console.log({ driver });
  const token = useAppSelector(selectToken);
  console.log({ token });
  const userId = user?._id;
  // const receiverId = "68b659c9778a2b206a349ed3";
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log({ data });
      setMessages((prev) => [...prev, `From ${data.senderId}: ${data.text}`]);
    });

    // Listen for notifications

    return () => {
      socket.off("receive_message");
    };
  }, [userId]);

  const sendMessage = () => {
    socket.emit("send_message", {
      senderId: userId,
      receiverId: selectedFriend?.user?._id,
      text: input,
    });
    setMessages((prev) => [...prev, `You: ${input}`]);
    setInput("");
  };

  console.log({ messages });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Friends list */}
      <div className="w-1/4 bg-white border-r border-gray-300 p-4">
        <h2 className="text-lg font-bold mb-4">Friends</h2>
        <ul>
          {driver?.map((el: any) => (
            <li
              key={el?._id}
              onClick={() => setSelectedFriend(el)}
              className={`p-2 cursor-pointer rounded ${
                selectedFriend?._id === el?._id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              {el?.user?.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {selectedFriend ? (
          <>
            <div className="p-4 border-b border-gray-300 font-bold">
              Chat with {selectedFriend?.user?.name}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages?.map((msg) => (
                <div
                  key={msg}
                  className={`p-2 rounded max-w-xs ${
                    msg === "me"
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-300 self-start"
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-300 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2 mr-2"
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
