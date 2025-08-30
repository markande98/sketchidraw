import {
  Message,
  User,
  WebsocketServerManager,
} from "./WebsocketServerManager.js";

type EncryptedData = {
  id: string;
  encryptedData: any;
};

export class RoomManager {
  public rooms: Map<string, User[]>;
  public encryptedDataInRooms: Map<string, EncryptedData[]>;
  static instance: RoomManager;

  private constructor() {
    this.rooms = new Map<string, User[]>();
    this.encryptedDataInRooms = new Map<string, EncryptedData[]>();
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

  public addOrUpdateEncryptedData(
    roomId: string,
    encryptedData: EncryptedData
  ) {
    if (!this.encryptedDataInRooms.has(roomId)) {
      this.encryptedDataInRooms.set(roomId, [encryptedData]);
      return;
    }
    this.encryptedDataInRooms.set(roomId, [
      ...(this.encryptedDataInRooms
        .get(roomId)
        ?.filter((e) => e.id !== encryptedData.id) ?? []),
      encryptedData,
    ]);
  }

  public updateUser(
    roomId: string,
    userId: string,
    cursorPos: { x: number; y: number }
  ) {
    if (!this.rooms.has(roomId)) return;
    let user = this.rooms.get(roomId)?.find((u) => u.id === userId);
    const otherUsers = this.rooms.get(roomId)?.filter((u) => u.id !== userId);
    if (user) {
      user = {
        ...user,
        cursorPos,
      };
      this.rooms.set(roomId, [...(otherUsers ?? []), user]);
    }
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

  public deleteEncryptedData(roomId: string, encryptedData: EncryptedData) {
    if (!this.encryptedDataInRooms.has(roomId)) return;
    const filteredEncryptedData =
      this.encryptedDataInRooms
        .get(roomId)
        ?.filter((data) => data.id !== encryptedData.id) ?? [];

    if (filteredEncryptedData.length > 0) {
      this.encryptedDataInRooms.set(roomId, filteredEncryptedData);
      return;
    }
    this.encryptedDataInRooms.delete(roomId);
  }
}
