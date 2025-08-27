export enum ServerEvents {
  Connection = "connection",
  Listening = "listening",
  Error = "error",
}

export enum WebSocketServerEvents {
  Message = "message",
  Joined = "joined",
  Pong = "pong",
  Error = "error",
  Close = "close",
}

export enum WebSocketClientEvents {
  Join = "join",
}
