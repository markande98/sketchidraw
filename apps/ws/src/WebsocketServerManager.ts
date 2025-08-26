import { v4 as uuidv4 } from "uuid";

import { WebSocketServer, WebSocket } from "ws";
import { ServerEvents, WebSocketEvents } from "./types.js";

export interface User {
  id: string;
  ws: WebSocket;
  isAlive: boolean;
  lastSeen: Date;
}

interface Message {
  type: WebSocketEvents;
  id?: string;
  data?: any;
  timestamp: number;
}

export interface ServerConfig {
  port: number;
  heartbeatInterval: number;
}

export class WebsocketServerManager {
  private wss: WebSocketServer;
  private users: Map<string, User>;
  private config: ServerConfig;
  private heartbeatTimer?: NodeJS.Timeout;

  constructor(config: ServerConfig) {
    this.config = config;
    this.users = new Map<string, User>();
    this.wss = new WebSocketServer({
      port: config.port,
      perMessageDeflate: {
        threshold: 1024,
        concurrencyLimit: 10,
        zlibDeflateOptions: {
          chunkSize: 16 * 1024,
          level: 3,
          memLevel: 7,
        },
      },
    });
    this.setupServer();
    this.startHeartbeat();
  }

  private setupServer() {
    this.wss.on(ServerEvents.Connection, (ws: WebSocket) => {
      const userId = uuidv4();
      const user: User = {
        id: userId,
        ws,
        isAlive: true,
        lastSeen: new Date(),
      };
      this.users.set(userId, user);
      console.log(`User connected: ${userId} (${this.users.size} total)`);

      // send message to user
      this.sendToUser(userId, {
        type: WebSocketEvents.Join,
        id: userId,
        data: { message: "Welcome to Websocket server!", userId },
        timestamp: Date.now(),
      });

      // notify all users except this user
      this.broadcast(
        {
          type: WebSocketEvents.Join,
          data: { message: `User ${userId} joined`, userId },
          timestamp: Date.now(),
        },
        userId
      );

      // setup ping/pong for heartbeat
      ws.on(WebSocketEvents.Pong, () => {
        const user = this.users.get(userId);
        if (user) {
          user.isAlive = true;
          user.lastSeen = new Date();
        }
      });

      // close events
      ws.on(WebSocketEvents.Close, () => {
        this.users.delete(userId);
      });

      // error events
      ws.on(WebSocketEvents.Error, (error: Error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
      });
    });

    this.wss.on(ServerEvents.Listening, () => {
      console.log(`🚀 WebSocket server listening on port ${this.config.port}`);
    });
    this.wss.on(ServerEvents.Error, (error: Error) => {
      console.error("WebSocket server error:", error);
    });
  }

  private sendToUser(userId: string, message: Message) {
    const user = this.users.get(userId);
    if (!user || user.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      user.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`Error sending message to ${userId}:`, error);
      this.users.delete(userId);
      return false;
    }
  }

  private broadcast(message: Message, excludeUserId?: string) {
    let sendCount = 0;
    for (const [userId, _user] of this.users) {
      if (excludeUserId && userId === excludeUserId) continue;
      if (this.sendToUser(userId, message)) {
        sendCount++;
      }
    }
    return sendCount;
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      for (const [userId, user] of this.users) {
        if (user.ws.readyState === WebSocket.OPEN) {
          if (!user.isAlive) {
            console.log(`Terminating inactive user: ${userId}`);
            user.ws.terminate();
            this.users.delete(userId);
            continue;
          }

          user.isAlive = false;
          user.ws.ping();
        } else {
          this.users.delete(userId);
        }
      }

      console.log(`💓 Heartbeat - Active users: ${this.users.size}`);
    }, this.config.heartbeatInterval);
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
      }
      this.wss.close(() => {
        console.log("Websocket server closed");
        resolve();
      });
    });
  }
}
