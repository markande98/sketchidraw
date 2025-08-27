export enum ServerEvents {
  Connection = "connection",
  Listening = "listening",
  Error = "error",
}

export enum WebSocketServerEvents {
  Message = "message",
  RoomJoined = "room-joined",
  UserJoined = "user-joined",
  UserLeaved = "user-leaved",
  Pong = "pong",
  Error = "error",
  Close = "close",
}

export enum WebSocketClientEvents {
  RoomJoin = "room-join",
  LeaveRoom = "leave-room",
}
