"use client";

import { E2EEncryption } from "@/lib/crypto";
import { useEffect, useRef, useState } from "react";
import { ClientEvents, ServerEvents } from "@/constants";
import { toast } from "sonner";

export type RoomInfo = {
  roomId: string;
  key: string;
};

type E2EWebsocketProps = {
  hash: string;
  currentUser: User | null;
};

export type User = {
  id: string;
  username: string;
  cursorPos: { x: number; y: number };
};

export const useE2EWebsocket = ({ hash, currentUser }: E2EWebsocketProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roomData, setRoomData] = useState<RoomInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket>(null);
  const encryptionRef = useRef<E2EEncryption>(null);

  useEffect(() => {
    if (!currentUser) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
    const extractRoomData = () => {
      if (hash.startsWith("#room=")) {
        const params = hash.substring(6);
        const [roomId, key] = params.split(",");
        return { roomId, key };
      }
      return null;
    };

    const roomInfo = extractRoomData();
    if (!roomInfo) return;

    setRoomData(roomInfo);

    encryptionRef.current = new E2EEncryption(roomInfo.key);
    const ws = new WebSocket(process.env.WS_URL || "ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: ClientEvents.RoomJoin,
          payload: {
            roomId: roomInfo.roomId,
            userId: currentUser.id,
            username: currentUser.username,
            cursorPos: { x: 0, y: 0 },
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case ServerEvents.RoomJoined:
          const { users } = data.payload;
          setUsers([...users]);
          toast.success(`Welcome to room ${currentUser.username} 👋`);
          break;
        case ServerEvents.UserJoined:
          const { user: userJoin } = data.payload;
          console.log("userjoin", userJoin);
          setUsers((prev) => {
            const userExists = prev.some(
              (existingUser) => existingUser.id === userJoin.id
            );
            if (userExists) {
              return prev;
            }
            console.log("reahed", [...prev, userJoin]);
            return [...prev, userJoin];
          });
          toast.success(`${userJoin.username} joined ✅`);
          break;
        case ServerEvents.UserLeaved:
          const { user: userLeave } = data.payload;
          setUsers((prev) => prev.filter((u) => u.id !== userLeave.id));
          toast.success(`${userLeave.username} leaved ❌`);
          break;
        case ServerEvents.CursorMoved:
          const { user: updatedUser } = data.payload;
          setUsers((prev) => {
            const otherUsers = prev.filter((u) => u.id !== updatedUser.id);
            return [...otherUsers, updatedUser];
          });
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setUsers([]);
    };
    ws.onerror = (error) => {
      console.log("Websocket error: ", error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        encryptionRef.current = null;
      }
    };
  }, [hash, currentUser]);

  return {
    roomData,
    isConnected,
    wsRef,
    users,
  };
};
