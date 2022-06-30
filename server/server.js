const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

var cors = require("cors");
const { getHeapStatistics } = require("v8");

const serverPort = 3001;

const messageHistory = [];
let userHistory = [];

app.use(cors());
app.get("/", (req, res) => {
  res.send(`good connect!`);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  // messageHistory.push({
  //   who: "server",
  //   msg: "Hello",
  // });
  io.emit("chat message", messageHistory);
  socket.on("chat message", (socket) => {
    console.log(`${socket.who} 측 메세지 : ${socket.msg}`);
  });
  socket.on("chat message", (socket) => {
    userHistory = userHistory.filter((his) => his.who !== socket.who);
    messageHistory.push(socket);
    io.emit("chat message", messageHistory);
  });
  socket.on("is writing", (socket) => {
    if (!userHistory.find((his) => his.who === socket.who)) {
      userHistory.push(socket);
    }
    io.emit("is writing", userHistory);
  });
  socket.on("remove history", (socket) => {
    userHistory = userHistory.filter((his) => his.who !== socket);
    io.emit("is writing", userHistory);
  });
  socket.on("out", (socket) => {
    messageHistory.push({
      who: "server",
      msg: socket + "님이 방을 나갔습니다.",
    });
    io.emit("out", messageHistory);
  });

  socket.on("disconnect", () => {
    console.log("사용자가 떠났습니다.");
  });
});

server.listen(serverPort, () => {
  console.log(`server listening on http://localhost:${serverPort}`);
});
