// MessagePage.tsx
import { useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../redux/hooks";
import { selectToken, selectUser } from "../redux/slice/userSlice";
import {
  useGetAllCompanyQuery,
  useSendMessageMutation,
} from "../redux/api/baseApi";

export default function DriverChat() {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const user = useAppSelector(selectUser);
  const { data } = useGetAllCompanyQuery(null);
  const company = data?.data;
  console.log({ company });
  const token = useAppSelector(selectToken);
  console.log({ token });
  const userId = user?._id;

  const handleSendMessage = async () => {
    const message = {
      sender: userId,
      receiver: selectedFriend?.user?._id,
      text: input,
    };
    console.log({ message });

    const result = await sendMessage({
      data: JSON.stringify(message),
    }).unwrap();
    console.log({ result });
    setMessages((prev) => [...prev, `You: ${input}`]);
    setInput("");
  };

  const locations = [
    { lat: 29.7525343, lng: -95.3590662 }, // Pickup - Houston
    { lat: 31.244, lng: -95.3127 },
    { lat: 32.7354, lng: -95.2664 },
    { lat: 34.2267, lng: -95.2202 },
    { lat: 35.7181, lng: -95.1739 },
    { lat: 37.2094, lng: -95.1276 },
    { lat: 38.7008, lng: -95.0813 },
    { lat: 40.1922, lng: -95.0351 },
    { lat: 41.6835, lng: -94.9888 },
    { lat: 43.1749, lng: -94.9425 },
    { lat: 44.6663, lng: -94.8962 },
    { lat: 46.1576, lng: -94.85 },
    { lat: 47.649, lng: -94.8037 },
    { lat: 47.794, lng: -95.2726 },
    { lat: 47.8, lng: -96.3 },
    { lat: 47.81, lng: -97.32 },
    { lat: 47.815, lng: -98.34 },
    { lat: 47.817, lng: -99.36 },
    { lat: 47.8187, lng: -100.38 },
    { lat: 47.6203953, lng: -122.3493709 }, // Delivery - Seattle
  ];

  let index = 0;
  const driverId = user?._id;

  // Emit every 5 seconds
  setInterval(() => {
    const location = locations[index];

    socket.emit("updateLocation", {
      userId: driverId,
      lat: location.lat,
      lng: location.lng,
    });

    console.log("Emitted static location:", location);

    index = (index + 1) % locations.length; // loop over locations
  }, 5000);

  console.log({ messages });

  socket.on(`driverLocation-${userId}`, (data) => {
    console.log("Driver location received:", data);
    // data = { userId, lat, lng }

    // Update map marker
    // updateMapMarker(data.lat, data.lng);
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Friends list */}
      <div className="w-1/4 bg-white border-r border-gray-300 p-4">
        <h2 className="text-lg font-bold mb-4">Friends</h2>
        <ul>
          {company?.map((el: any) => (
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
                  <h1 className=""> {msg}</h1>
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
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
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
