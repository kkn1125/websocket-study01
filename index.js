const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

var cors = require("cors");

const serverPort = 3001;

const messageHistory = [];

app.use(cors());
app.get("/", (req, res) => {
  res.send(`good connect!`);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  messageHistory.push({
    who: "server",
    msg: "Hello",
  });
  io.emit("chat message", messageHistory);
  socket.on("chat message", (socket) => {
    messageHistory.push(socket);
    console.log(`${socket.who} 측 메세지 : ${socket.msg}`);
    io.emit("chat message", messageHistory);
  });

  socket.on("disconnect", () => {
    console.log("사용자가 떠났습니다.");
  });
});

server.listen(serverPort, () => {
  console.log(`server listening on http://localhost:${serverPort}`);
});
