"use client";

import { E2EEncryption } from "@/lib/crypto";
import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "./use-current-user";

type RoomInfo = {
  roomId: string;
  key: string;
};

type E2EWebsocketProps = {
  hash: string;
};

export const useE2EWebsocket = ({ hash }: E2EWebsocketProps) => {
  const { user } = useCurrentUser();
  const [roomData, setRoomData] = useState<RoomInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket>(null);
  const encryptionRef = useRef<E2EEncryption>(null);

  useEffect(() => {
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
          type: "join",
          payload: {
            roomId: roomInfo.roomId,
            userId: user?.id,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };
    ws.onerror = (error) => {
      console.log("Websocket error: ", error);
    };

    return () => {
      ws.close();
    };
  }, [user?.id, hash]);

  return {
    roomData,
    isConnected,
  };
};
