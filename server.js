const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
//Initializing variables
const app = express();
app.use(cors());
require("dotenv").config();

const server = http.createServer(app);
const io = socketio(server);
// const authMiddleware = require("./middleware/auth-middleware");

const PORT = process.env.PORT || 5000;

//Connecting to DB
mongoose.connect(
  process.env.DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
);

//Using CORS middleware
app.use(cors());
//Using express JSON parse middleware
app.use(express.json());

//Setting up web sockets
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ user, room }) => {
    socket.join(room);
    socket.username = user.name; //We gave the sockets a username property so that we could use it to identify which user just disconnected
    socket.chatroom = room;
    socket.broadcast
      .to(socket.chatroom)
      .emit("welcomeUser", `${user.name} has joined the room`);
  });
  socket.on("leaveRoom", () => {
    socket.broadcast
      .to(socket.chatroom)
      .emit("welcomeUser", `${socket.username} has left the room`);
    socket.leave(socket.chatroom);
  });
  socket.on("message", (message) => {
    io.to(socket.chatroom).emit("message", message);
  });
  socket.on("disconnect", () => {
    socket.broadcast
      .to(socket.chatroom)
      .emit("welcomeUser", `${socket.username} has disconnected.`);
    socket.leave(socket.chatroom);
  });
});

//Importing route files
const authRoutes = require("./routes/authRoutes");

//Routes middleware
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  res.status(400);
  res
    .status(error.code || 500)
    .json({ msg: error.message || "An error has occured" });
});

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
