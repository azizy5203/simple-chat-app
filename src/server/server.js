const io = require("socket.io")(5666, {
    cors: {
      origin: "*",
    },
  });
  
  // Store chat history
  const messageHistory = [];
  
  io.on("connection", (socket) => {
    console.log("🚀 New connection:", socket.id);
  
    // Send welcome message + history
    socket.emit("connected", {
      message: "Connected successfully!",
      history: messageHistory,
    });
  
    // Broadcast chat messages
    socket.on("chat-message", (message) => {
      const msgData = {
        message,
        sender: socket.id,
        time: new Date().toLocaleTimeString(),
      };
  
      messageHistory.push(msgData); // Store message
      socket.broadcast.emit("message-recieved", msgData); // Broadcast to others
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });