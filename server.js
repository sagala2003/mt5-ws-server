
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
app.use(express.static(path.join(__dirname)));

// WebSocket broadcast
function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// HTTP POST endpoint untuk MT5 EA
app.post("/api/ticker", (req, res) => {
  console.log("📥 Received ticker data via HTTP:", req.body);
  broadcast(req.body);  // kirim ke semua WebSocket client
  res.json({ status: "ok" });
});

// Status endpoint
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// WebSocket
wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");
  ws.send(JSON.stringify({ status: "connected" }));
});

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
