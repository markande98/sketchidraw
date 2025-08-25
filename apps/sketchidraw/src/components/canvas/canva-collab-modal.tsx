"use client";

import { CanvaModalType } from "@/constants";
import { LiveStartButtonSvg } from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { generateAlphanumericSubstring } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const CanvaCollabModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, canvaModalType } = useCanva();
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

  const handleStartSession = useCallback(() => {
    const roomId = generateAlphanumericSubstring(20);
    const key = generateAlphanumericSubstring(22);
    const fragment = `#room=${roomId},${key}`;
    const url = `${window.location.origin}${fragment}`;
    router.replace(url);
    onOpen(CanvaModalType.Share);
  }, [router, onOpen]);

  const isModalOpen = showModal && canvaModalType === CanvaModalType.Session;

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
