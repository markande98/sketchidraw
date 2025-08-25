"use client";

import { useCanva } from "@/hooks/use-canva-store";
import { saveToLocalStorage } from "@/lib/utils";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { CanvaModalType } from "@/constants";

type CanvaClearModalProps = {
  setSelectedShapeIndex: React.Dispatch<SetStateAction<number | null>>;
};
export const CanvaClearModal = ({
  setSelectedShapeIndex,
}: CanvaClearModalProps) => {
  const { isOpen, canvaModalType, onClose, onSetCanvaShapes } = useCanva();
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setSelectedShapeIndex(null);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, setSelectedShapeIndex]);

  const handleConfirm = useCallback(() => {
    saveToLocalStorage([]);
    onSetCanvaShapes([]);
    setShowModal(false);
    setSelectedShapeIndex(null);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, onSetCanvaShapes, setSelectedShapeIndex]);

  const isModalOpen = showModal && canvaModalType === CanvaModalType.Clear;

  console.log(isModalOpen);

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
        className="flex flex-col dark:border-2 border-surface-high rounded-md p-10 w-full max-w-[550px] shadow-md space-y-4 bg-white dark:bg-surface-low"
      >
        <h1 className="text-xl text-on-surface font-extrabold font-comicShanns">
          Clear canvas
        </h1>
        <Separator />
        <p className="text-on-surface font-comicShanns">
          This will clear the whole canvas. Are you sure?
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleCancel}
            className="py-3 px-4 text-sm rounded-md font-comicShanns cursor-pointer border border-default-border-color"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="text-white text-sm font-comicShanns dark:text-[#121212] py-3 px-4 rounded-md cursor-pointer border border-default-border-color bg-danger"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
