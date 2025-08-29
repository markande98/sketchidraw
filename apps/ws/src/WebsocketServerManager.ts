import { WebSocketServer, WebSocket } from "ws";
import {
  ServerEvents,
  WebSocketClientEvents,
  WebSocketServerEvents,
} from "./types.js";
import { RoomManager } from "./RoomManager.js";

export interface User {
  id: string;
  username: string;
  cursorPos: { x: number; y: number };
  ws: WebSocket;
  isAlive: boolean;
  lastSeen: Date;
}

export interface Message {
  type: WebSocketServerEvents;
  payload: {
    id?: string;
    message?: string;
    users?: {
      id: string;
      username?: string;
      cursorPos?: { x: number; y: number };
    }[];
    user?: {
      id: string;
      username?: string;
      cursorPos?: { x: number; y: number };
    };
    timestamp: number;
  };
}

export interface ServerConfig {
  port: number;
  heartbeatInterval: number;
}

export class WebsocketServerManager {
  private wss: WebSocketServer;
  private config: ServerConfig;
  private heartbeatTimer?: NodeJS.Timeout;

  constructor(config: ServerConfig) {
    this.config = config;
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
      ws.on(WebSocketServerEvents.Message, (data) => {
        const parsedData = JSON.parse(data.toString());
        const { userId, roomId, username, cursorPos } = parsedData.payload;

        const user: User = {
          id: userId,
          username,
          cursorPos,
          ws,
          isAlive: true,
          lastSeen: new Date(),
        };

        switch (parsedData.type) {
          case WebSocketClientEvents.RoomJoin:
            RoomManager.getInstance().addUser(roomId, user);
            console.log(
              `User connected: ${userId} (${RoomManager.getInstance().rooms.get(roomId)?.length} total)`
            );
            // send to user
            WebsocketServerManager.sendToUser(user, {
              type: WebSocketServerEvents.RoomJoined,
              payload: {
                id: userId,
                message: "Welcome to Websocket server!",
                users: RoomManager.getInstance()
                  .rooms.get(roomId)
                  ?.map((u) => ({
                    id: u.id,
                    username: u.username,
                    cursorPos: u.cursorPos,
                  })),
                timestamp: Date.now(),
              },
            });
            // notify all users except this user
            RoomManager.getInstance().broadcast(
              {
                type: WebSocketServerEvents.UserJoined,
                payload: {
                  message: `User ${user.id} joined`,
                  user: {
                    id: user.id,
                    username: user.username,
                    cursorPos: user.cursorPos,
                  },
                  timestamp: Date.now(),
                },
              },
              user,
              roomId
            );
            break;
          case WebSocketClientEvents.LeaveRoom:
            RoomManager.getInstance().removeUser(roomId, user);
            RoomManager.getInstance().broadcast(
              {
                type: WebSocketServerEvents.UserLeaved,
                payload: {
                  message: `User ${userId} leaved`,
                  user: {
                    id: user.id,
                  },
                  timestamp: Date.now(),
                },
              },
              user,
              roomId
            );
            break;
          case WebSocketClientEvents.CursorMove:
            RoomManager.getInstance().updateUser(roomId, userId, cursorPos);
            RoomManager.getInstance().broadcast(
              {
                type: WebSocketServerEvents.CursorMoved,
                payload: {
                  user: {
                    id: user.id,
                    cursorPos,
                  },
                  timestamp: Date.now(),
                },
              },
              user,
              roomId
            );
            break;
          default:
            break;
        }
        // setup ping/pong for heartbeat
        ws.on(WebSocketServerEvents.Pong, () => {
          const user = RoomManager.getInstance()
            .rooms.get(roomId)
            ?.find((u) => u.id === userId);
          if (user) {
            user.isAlive = true;
            user.lastSeen = new Date();
          }
        });

        // close events
        ws.on(WebSocketServerEvents.Close, () => {
          RoomManager.getInstance().removeUser(roomId, user);
        });

        // error events
        ws.on(WebSocketServerEvents.Error, (error: Error) => {
          console.error(`WebSocket error for user ${userId}:`, error);
        });
      });
    });

    this.wss.on(ServerEvents.Listening, () => {
      console.log(`🚀 WebSocket server listening on port ${this.config.port}`);
    });
    this.wss.on(ServerEvents.Error, (error: Error) => {
      console.error("WebSocket server error:", error);
    });
  }

  static sendToUser(user: User, message: Message) {
    if (!user || user.ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    try {
      user.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`Error sending message to ${user.id}:`, error);
      return false;
    }
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      const rooms = RoomManager.getInstance().rooms.entries();
      for (const [roomId, users] of rooms) {
        for (const user of users) {
          if (user.ws.readyState === WebSocket.OPEN) {
            if (!user.isAlive) {
              console.log(`Terminating inactive user: ${user.id}`);
              user.ws.terminate();
              RoomManager.getInstance().removeUser(roomId, user);
              continue;
            }

            user.isAlive = false;
            user.ws.ping();
          } else {
            RoomManager.getInstance().removeUser(roomId, user);
          }
        }
        console.log(
          `💓 Heartbeat - Active users in room with Id ${roomId}: ${RoomManager.getInstance().rooms.get(roomId)?.length}`
        );
      }
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
