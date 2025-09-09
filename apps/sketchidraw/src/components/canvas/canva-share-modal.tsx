"use client";

import { CanvaModalType, ClientEvents } from "@/constants";

import {
  CopySvg,
  ShareLinkButtonSvg,
  StopSessionButtonSvg,
} from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { RefObject, useCallback, useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

type CanvaShareModalProps = {
  wsRef: RefObject<WebSocket | null>;
  roomId?: string;
};

export const CanvaShareModal = ({ wsRef, roomId }: CanvaShareModalProps) => {
  const { currentUser } = useCurrentUser();
  const { isOpen, onClose, canvasData, canvasModalType } = useCanva();
  const [showModal, setShowModal] = useState(isOpen);
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleCloseSession = useCallback(() => {
    window.location.hash = "";
    // emit an event to notify users that he left.
    if (wsRef.current && roomId) {
      wsRef.current.send(
        JSON.stringify({
          type: ClientEvents.LeaveRoom,
          payload: {
            roomId,
            userId: currentUser?.id,
            username: currentUser?.username,
          },
        })
      );
      wsRef.current.close();
    }
    onClose();
  }, [onClose, currentUser, wsRef, roomId]);

  const handleCopy = async () => {
    try {
      setIsCopy(true);
      await navigator.clipboard.writeText(canvasData || "");
      setTimeout(() => {
        setIsCopy(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const isModalOpen = showModal && canvasModalType === CanvaModalType.Share;

  if (!isModalOpen) return null;
  return (
    <div
      onClick={handleCancel}
      className="
                        flex
                        justify-center
                        items-center
                        overflow-x-hidden
                        overflow-y-auto
                        absolute
                        z-[200]
                        inset-0
                        outline-none
                        focus:outline-none
                        bg-neutral-800/5
                    "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col dark:border-2 border-surface-high rounded-md p-10 w-full max-w-[550px] shadow-md space-y-6 bg-white dark:bg-surface-low"
      >
        <h1 className="text-xl text-on-surface font-extrabold font-comicShanns">
          Live collaboration
        </h1>

        <div className="flex flex-col">
          <p className="text-sm text-on-surface font-comicShanns">Link</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={canvasData || ""}
              className="flex-1 p-3 border border-[#c5c5d0] dark:border-[#46464f] focus:outline-none dark:bg-surface-high bg-[#f1f0ff] rounded-md truncate"
            />
            <button
              onClick={handleCopy}
              className={cn(
                "w-35 flex items-center justify-center gap-2 rounded-md cursor-pointer text-surface-lowest bg-primary py-3 px-4 font-comicShanns hover:bg-brand-hover transition duration-150",
                isCopy && "bg-yellow-200 hover:bg-yellow-200"
              )}
            >
              {!isCopy && (
                <>
                  <ShareLinkButtonSvg />
                  Copy link
                </>
              )}
              {isCopy && <CopySvg />}
            </button>
          </div>
        </div>

        <Separator className="w-full bg-[#ebebeb]" />

        <div className="flex flex-col space-y-2">
          <p className="text-xs text-on-surface">
            🔒 Don&apos;t worry, the session is end-to-end encrypted, and fully
            private. Not even our server can see what you draw.
          </p>
          <p className="text-xs text-on-surface">
            Stopping the session will disconnect you from the room, but
            you&apos;ll be able to continue working with the scene, locally.
            Note that this won&apos;t affect other people, and they&apos;ll
            still be able to collaborate on their version.
          </p>
        </div>

        <div className="flex items-center justify-center cursor-pointer">
          <button
            onClick={handleCloseSession}
            className="py-3 flex items-center gap-2 bg-transparent border-danger text-danger hover:text-danger-darker hover:border-danger-darker px-4 text-sm rounded-md font-comicShanns cursor-pointer border transition duration-150"
          >
            <StopSessionButtonSvg />
            Stop session
          </button>
        </div>
      </div>
    </div>
  );
};
