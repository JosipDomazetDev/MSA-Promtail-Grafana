const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Simple structured logger that writes to stdout (picked up by Docker)
function log(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(entry));
}

app.use((req, res, next) => {
  log("info", "Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

app.get("/", (req, res) => {
  log("info", "Root endpoint called");
  res.json({ status: "ok", message: "Docker Logging Demo API" });
});

app.get("/hello/:name", (req, res) => {
  const { name } = req.params;
  log("info", `Hello endpoint called`, { name });
  res.json({ message: `Hello, ${name}!` });
});

app.get("/error", (req, res) => {
  log("error", "Simulated error endpoint triggered", { code: "SIMULATED_ERROR" });
  res.status(500).json({ error: "This is a simulated error for logging demo" });
});

app.get("/warn", (req, res) => {
  log("warn", "Simulated warning triggered", { threshold: "exceeded" });
  res.json({ warning: "Threshold exceeded (simulated)" });
});

app.get("/health", (req, res) => {
  log("debug", "Health check");
  res.json({ status: "healthy", uptime: process.uptime() });
});

app.listen(PORT, () => {
  log("info", "API server started", { port: PORT });
});
