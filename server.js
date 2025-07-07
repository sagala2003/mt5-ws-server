const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // untuk file index.html

// WebSocket broadcast function
function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Endpoint MT5 EA untuk kirim data
app.post("/api/ticker", (req, res) => {
  console.log("📥 Received ticker data via HTTP:", req.body);

  // Validasi sederhana
  if (!req.body || !req.body.timestamp || !req.body.data) {
    return res.status(400).json({ status: "error", message: "Invalid format" });
  }

  // Kirim ke semua client WebSocket
  broadcast(req.body);

  res.json({ status: "ok" });
});

// Endpoint untuk tes server
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// WebSocket client handler
wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");
  ws.send(JSON.stringify({ status: "connected" }));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
