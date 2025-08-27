"use client";

import { E2EEncryption } from "@/lib/crypto";
import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "./use-current-user";
import { ClientEvents, ServerEvents } from "@/constants";

type RoomInfo = {
  roomId: string;
  key: string;
};

type E2EWebsocketProps = {
  hash: string;
};

type User = {
  id: string;
  username: string;
};

export const useE2EWebsocket = ({ hash }: E2EWebsocketProps) => {
  const { user } = useCurrentUser();
  const [roomData, setRoomData] = useState<RoomInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const wsRef = useRef<WebSocket>(null);
  const encryptionRef = useRef<E2EEncryption>(null);

  useEffect(() => {
    if (wsRef.current) return;
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
          type: ClientEvents.Join,
          payload: {
            roomId: roomInfo.roomId,
            userId: user?.id,
            username: user?.name,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case ServerEvents.Joined:
          const { users } = data.payload;
          setUsers([...users]);
          break;
        case ServerEvents.Broadcast:
          const { user } = data.payload;
          setUsers((prev) => {
            const userExists = prev.some(
              (existingUser) => existingUser.id === user.id
            );
            if (userExists) {
              return prev;
            }
            return [...prev, user];
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
      }
    };
  }, [user, hash]);

  return {
    roomData,
    isConnected,
    users,
  };
};
