const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data.roomId);
  });
  socket.on("send_message", (data) => {
    socket
      .to(data.roomId)
      .emit("receive_message", { name: data.name, message: data.message });
  });
  // socket.on("send_message", (message) => {
  //   socket.broadcast.emit("receive_message", { data: message });
  // });
  socket.on("forceDisconnect", function () {
    socket.disconnect();
  });
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log("server started on 3000");
});
