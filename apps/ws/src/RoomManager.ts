import {
  Message,
  User,
  WebsocketServerManager,
} from "./WebsocketServerManager.js";

export class RoomManager {
  public rooms: Map<string, User[]>;
  static instance: RoomManager;

  private constructor() {
    this.rooms = new Map<string, User[]>();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  public addUser(roomId: string, user: User) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, [user]);
      return;
    }
    const hasUser = this.rooms.get(roomId)?.some((u) => u.id === user.id);
    if (!hasUser)
      this.rooms.set(roomId, [...(this.rooms.get(roomId) ?? []), user]);
  }

  public broadcast(message: Message, user: User, roomId: string) {
    if (!this.rooms.has(roomId)) return;
    this.rooms.get(roomId)?.forEach((u) => {
      if (u.id !== user.id) {
        WebsocketServerManager.sendToUser(u, message);
      }
    });
  }
  public removeUser(roomId: string, user: User) {
    if (!this.rooms.has(roomId)) return;
    const users = this.rooms.get(roomId)?.filter((u) => u.id !== user.id) ?? [];
    if (users.length > 0) {
      this.rooms.set(roomId, users);
      return;
    }
    this.rooms.delete(roomId);
  }
}
