"use client";

import { ClientEvents, ServerEvents } from "@/constants";
import { E2EEncryption } from "@/lib/crypto";
import { Shape } from "@/types/shape";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [roomData, setRoomData] = useState<RoomInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket>(null);
  const encryptionRef = useRef<E2EEncryption>(null);

  const sendLeaveNotification = useCallback(() => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      currentUser &&
      roomData
    ) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: ClientEvents.LeaveRoom,
            payload: {
              roomId: roomData.roomId,
              userId: currentUser.id,
              username: currentUser.username,
            },
          })
        );
      } catch (error) {
        console.log("Failed to send leave notification:", error);
      }
    }
  }, [currentUser, roomData]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sendLeaveNotification();
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "User closed tab");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sendLeaveNotification]);

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
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"
    );
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

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case ServerEvents.RoomJoined:
          try {
            const { users, dataToDecrypt } = data.payload;

            const newShapes = await Promise.all(
              dataToDecrypt.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                async (data: any) => await encryptionRef.current?.decrypt(data)
              )
            );
            setUsers([...users]);
            setShapes([...newShapes]);
            toast.success(`Welcome to room ${currentUser.username} 👋`);
          } catch (error) {
            console.log("failed to join room or decrypt message: ", error);
            if (error instanceof Error) {
              ws.close(1007, error.message);
            }
          }
          break;
        case ServerEvents.UserJoined:
          const { user: userJoin } = data.payload;
          setUsers((prev) => {
            const userExists = prev.some(
              (existingUser) => existingUser.id === userJoin.id
            );
            if (userExists) {
              return prev;
            }
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
          setUsers((prev) =>
            prev.map((existingUser) =>
              existingUser.id === updatedUser.id
                ? {
                    ...existingUser,
                    cursorPos: updatedUser.cursorPos,
                  }
                : existingUser
            )
          );
          break;
        case ServerEvents.Decryption:
          const { encryptedData, toBeAdded, toBeDeleted } = data.payload;
          try {
            const decryptedData: Shape =
              await encryptionRef.current?.decrypt(encryptedData);
            // update shape state.
            if (toBeAdded) {
              setShapes((prev) => {
                const existingShape = prev.find(
                  (s) => s.id === decryptedData.id
                );
                if (!existingShape) return [...prev, decryptedData];
                return prev.map((s) =>
                  s.id === decryptedData.id ? { ...decryptedData } : s
                );
              });
              return;
            }
            if (toBeDeleted) {
              setShapes((prev) =>
                prev.filter((s) => s.id !== decryptedData.id)
              );
              return;
            }
            setShapes((prev) => {
              const existingShape = prev.find((s) => s.id === decryptedData.id);
              if (!existingShape) return [...prev, decryptedData];
              return prev.map((s) =>
                s.id === decryptedData.id ? { ...decryptedData } : s
              );
            });
          } catch (error) {
            console.log("failed to decrypt message: ", error);
            if (error instanceof Error) {
              ws.close(1007, error.message);
            }
          }
          break;
        default:
          break;
      }
    };

    ws.onclose = (ev: CloseEvent) => {
      if (ev.code === 1007) {
        toast.error(ev.reason);
      }
      setIsConnected(false);
      setUsers([]);
      setShapes([]);
      wsRef.current = null;
      encryptionRef.current = null;
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

  const sendEncryptedMessage = useCallback(
    async (
      shape: Shape,
      type: ClientEvents,
      toBeAddedOrUpdated: boolean,
      toBeDeleted: boolean
    ) => {
      if (
        !currentUser ||
        !wsRef.current ||
        wsRef.current.readyState !== WebSocket.OPEN
      ) {
        throw new Error("Websocket not connected");
      }
      if (!encryptionRef.current) {
        throw new Error("Encryption not initialized");
      }
      if (!roomData) {
        throw new Error("Room is not initialized");
      }

      try {
        const encryptedData = await encryptionRef.current.encrypt(shape);
        // send encrypted payload to server
        wsRef.current.send(
          JSON.stringify({
            type,
            payload: {
              roomId: roomData.roomId,
              userId: currentUser.id,
              encryptedData,
              flags: {
                encryptedDataId: shape.id,
                toBeAddedOrUpdated,
                toBeDeleted,
              },
            },
          })
        );
        if (toBeAddedOrUpdated) {
          setShapes((prev) => {
            const existingShape = prev.find((s) => s.id === shape.id);
            if (!existingShape) return [...prev, shape];
            return prev.map((s) => (s.id === shape.id ? { ...shape } : s));
          });
          return;
        }
        if (toBeDeleted) {
          setShapes((prev) => prev.filter((s) => s.id !== shape.id));
          return;
        }
        setShapes((prev) => {
          const existingShape = prev.find((s) => s.id === shape.id);
          if (!existingShape) return [...prev, shape];
          return prev.map((s) => (s.id === shape.id ? { ...shape } : s));
        });
      } catch (error) {
        console.log("Failed to encrypt message:", error);
        throw error;
      }
    },
    [roomData, currentUser]
  );

  return {
    roomData,
    isConnected,
    wsRef,
    users,
    sendEncryptedMessage,
    shapes,
  };
};
