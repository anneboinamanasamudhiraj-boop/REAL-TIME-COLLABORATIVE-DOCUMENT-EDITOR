const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let documentText = "";

io.on("connection", (socket) => {
  console.log("User Connected");

  // Send existing data to new user
  socket.emit("load-document", documentText);

  // Receive changes from user
  socket.on("send-changes", (data) => {
    documentText = data;
    socket.broadcast.emit("receive-changes", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server Running on Port 5000");
});