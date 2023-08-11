import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

let socket;

function App() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [status, setStatus] = useState({ connected: false, message: "" });

  const joinRoom = () => {
    connectSocket();
    socket.emit("join_room", { roomId: roomId });
    setStatus((prev) => {
      return {
        ...prev,
        connected: true,
        message: `connected to room {${roomId}} as ${name}`,
      };
    });
  };

  const leaveRoom = () => {
    setStatus((prev) => {
      return { ...prev, connected: false, message: "disconnected" };
    });
    disconnectSocket();
  };

  const updateMessages = () => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, `${data.name}: ${data.message}`]);
    });
  };

  useEffect(() => {
    if (socket) {
      console.log(socket);
      updateMessages();
    }
  }, [socket]);

  const sendMessage = (event) => {
    // event.preventDefault()
    socket.emit("send_message", {
      roomId: roomId,
      message: message,
      name: name,
    });
    setMessage("");
    setMessages((prev) => [...prev, "you: " + message]);
  };

  const disconnectSocket = () => {
    socket.emit("forceDisconnect");
  };

  const connectSocket = () => {
    socket = io.connect("http://localhost:3000");
  };

  return (
    <>
      <h4>{status.message}</h4>
      <ul>
        {messages.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="enter your name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        placeholder="enter room id"
        value={roomId}
        onChange={(e) => {
          setRoomId(e.target.value);
        }}
      />
      {status.connected ? (
        <button onClick={leaveRoom}>leave</button>
      ) : (
        <button onClick={joinRoom}>join</button>
      )}
      <div>
        <input
          type="text"
          placeholder="enter message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>send</button>
      </div>
    </>
  );
}

export default App;
