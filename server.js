const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let documentData = "Welcome to the Collaborative Editor! Start typing...";

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send current doc to new user
  socket.emit("load-document", documentData);

  // When user edits
  socket.on("send-changes", (delta) => {
    documentData = delta; // Update memory
    socket.broadcast.emit("receive-changes", delta);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Serve React build in production
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
