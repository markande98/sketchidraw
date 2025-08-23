"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useCanva } from "@/hooks/use-canva-store";
import { saveToLocalStorage } from "@/lib/utils";

type CanvaClearModalProps = {
  setSelectedShapeIndex: React.Dispatch<SetStateAction<number | null>>;
};
export const CanvaClearModal = ({
  setSelectedShapeIndex,
}: CanvaClearModalProps) => {
  const { isOpen, onClose, onSetCanvaShapes } = useCanva();
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

  if (!showModal) return null;

  return (
    <>
      <div
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
                    bg-neutral-800/20
                "
      >
        <div className="flex flex-col rounded-md p-10 w-full max-w-[550px] shadow-md space-y-4 bg-surface-low">
          <h1 className="text-xl text-on-surface font-extrabold font-sketchifont">
            Clear canvas
          </h1>
          <Separator />
          <p className="text-on-surface font-sketchifont">
            This will clear the whole canvas. Are you sure?
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={handleCancel}
              className="p-6 cursor-pointer font-sketchifont"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="p-6 cursor-pointer font-sketchifont"
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
