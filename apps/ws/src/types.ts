export enum ServerEvents {
  Connection = "connection",
  Listening = "listening",
  Error = "error",
}

export enum WebSocketServerEvents {
  Message = "message",
  Pong = "pong",
  Error = "error",
  Close = "close",
  RoomJoined = "room-joined",
  UserJoined = "user-joined",
  UserLeaved = "user-leaved",
  CursorMoved = "cursor-moved",
  Decryption = "decryption",
}

export enum WebSocketClientEvents {
  RoomJoin = "room-join",
  LeaveRoom = "leave-room",
  CursorMove = "cursor-move",
  Encryption = "encryption",
}
