const socket = io("http://localhost:5666", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  // Add timeout to help with debugging
  timeout: 10000,
});

const messageWrapper = document.querySelector(".message-wrapper");
const messageForm = document.querySelector(".message-form");
const messageInput = document.querySelector(".message-input");

// Listen for successful connection
socket.on("connect", () => {
  messageWrapper.innerHTML += `<div class="log-message">Connected successfully!</div>`;
  console.log("🚀 ~ connected ~ socket.id:", socket.id);
});

// Listen for the custom "connected" event from server
socket.on("connected", (message) => {
  console.log("🚀 ~ server message:", message);
});

// Listen for incoming messages
socket.on("message-recieved", (message) => {
  console.log("🚀 ~ received message:", message);
  // Display the message in your UI here

  const sender = message.sender === socket.id ? "me" : "friend";
  const msgClass =
    message.sender === socket.id ? "my-message" : "incoming-message";
  const messageData = message.message;

  if (sender == "me") return;
  messageWrapper.innerHTML += `
  <div class="${msgClass}">
    <b>${sender}:</b>
    <br>
    <div>${messageData}</div>
    <div class="message-time">${message.time}</div>
  </div>
  `;
});

// Enhance error handling
socket.on("connect_error", (error) => {
  console.error("Connection failed:", error.message);
  console.log("Server URL:", socket.io.uri);
  messageWrapper.innerHTML += `<div class="log-message log-message--error">connection failed. retrying</div>`;
  messageWrapper.scrollTop = messageWrapper.scrollHeight;
});

// Add disconnect handler
socket.on("disconnect", (reason) => {
  console.log("Disconnected from server:", reason);
});

// Handle form submission
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("chat-message", message);
    messageWrapper.innerHTML += `
    <div class="my-message">
        <b>me:</b>
        <br>
        <div>${message}</div>
    <div class="message-time">${new Date().toLocaleTimeString()}</div>

    </div>
  `;
    messageInput.value = "";
    messageWrapper.scrollTop = messageWrapper.scrollHeight;
  }
});
