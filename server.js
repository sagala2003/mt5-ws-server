
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname)));

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

ws.on("message", (message) => {
  console.log("📥 Received:", message);

  // Kirim pesan ke semua client termasuk browser viewer
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);  // broadcast data asli ke semua client
    }
  });
});

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 WebSocket server running on port", PORT);
});
