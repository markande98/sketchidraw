import {
  ServerConfig,
  WebsocketServerManager,
} from "./WebsocketServerManager.js";

const config: ServerConfig = {
  port: parseInt(process.env.PORT || "8080"),
  heartbeatInterval: 30000,
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
