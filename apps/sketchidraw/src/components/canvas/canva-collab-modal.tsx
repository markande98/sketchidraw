"use client";

import { createRoom } from "@/actions/create-room";
import { CanvaModalType } from "@/constants";
import { LiveStartButtonSvg } from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { generateAlphanumericSubstring } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const CanvaCollabModal = () => {
  const { currentUser } = useCurrentUser();
  const { isOpen, onOpen, onClose, canvasModalType } = useCanva();
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleStartSession = useCallback(async () => {
    if (!currentUser) return;
    try {
      const roomId = await createRoom(currentUser.id);
      const key = generateAlphanumericSubstring(22);
      const fragment = `#room=${roomId},${key}`;
      const url = `${window.location.origin}/${fragment}`;
      onOpen(CanvaModalType.Share, url);
      window.location.hash = fragment;
    } catch (error) {
      console.log(error);
      toast.error("Some error occured!, try again");
    }
  }, [onOpen, currentUser]);

  const isModalOpen = showModal && canvasModalType === CanvaModalType.Session;

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
        className="flex flex-col items-center dark:border-2 border-surface-high rounded-md p-10 w-full max-w-[550px] shadow-md space-y-6 bg-white dark:bg-surface-low"
      >
        <h1 className="text-xl text-center text-primary font-extrabold font-comicShanns">
          Live collaboration
        </h1>
        <p className="text-sm text-primary-color font-comicShanns">
          Invite people to collaborate on your drawing.
        </p>
        <p className="text-sm text-primary-color text-center font-comicShanns">
          Don&apos;t worry, the session is end-to-end encrypted, and fully
          private. Not even our server can see what you draw.
        </p>
        <div className="flex items-center justify-center">
          <button
            onClick={handleStartSession}
            className="py-3 flex items-center gap-2 bg-primary text-surface-lowest px-4 text-sm rounded-md font-comicShanns cursor-pointer border border-default-border-color"
          >
            <LiveStartButtonSvg />
            Start session
          </button>
        </div>
      </div>
    </div>
  );
};
