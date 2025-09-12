import dotenv from "dotenv";

dotenv.config();

import {
  ServerConfig,
  WebsocketServerManager,
} from "./WebsocketServerManager.js";

const config: ServerConfig = {
  port: parseInt(process.env.PORT || "3001"),
  heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL || "20000"),
  allowedOrigins: [
    process.env.ALLOWED_ORIGIN!,
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
  ],
};

const server = new WebsocketServerManager(config);

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await server.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down server...");
  await server.close();
  process.exit(0);
});
