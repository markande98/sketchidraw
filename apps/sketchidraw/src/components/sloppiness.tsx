"use client";

import { useCanva } from "@/hooks/use-canva-store";
import { ClientEvents, Sloppiness as SLOPPINESS } from "@/constants/index";
import { ArchitectSvg, ArtistSvg, CartoonistSvg } from "@/constants/svg";
import { cn } from "@/lib/utils";
import { Shape } from "@/types/shape";

type SloppinessProps = {
  selectedShapeId: string | null;
  isConnected: boolean;
  shapes: Shape[];
  sendEncryptedMessage: (
    shape: Shape,
    type: ClientEvents,
    toBeAdded: boolean,
    toBeDeleted: boolean
  ) => void;
};

export const Sloppiness = ({
  selectedShapeId,
  isConnected,
  shapes,
  sendEncryptedMessage,
}: SloppinessProps) => {
  const {
    canvaSloppiness,
    onSetCanvaSloppiness,
    canvaShapes,
    onSetCanvaShapes,
  } = useCanva();

  let newShapes = isConnected ? shapes : canvaShapes;

  const onClick = (sloppiness: SLOPPINESS) => {
    onSetCanvaSloppiness(sloppiness);
    if (selectedShapeId !== null) {
      let shapeToUpdate = newShapes.find((s) => s.id === selectedShapeId)!;
      shapeToUpdate = {
        ...shapeToUpdate,
        sloppiness,
      };
      if (isConnected) {
        sendEncryptedMessage(
          shapeToUpdate,
          ClientEvents.Encryption,
          true,
          false
        );
      } else {
        newShapes = canvaShapes.map((s) =>
          s.id === selectedShapeId ? shapeToUpdate : s
        );
        onSetCanvaShapes([...newShapes]);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Sloppiness
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(SLOPPINESS.Architect);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaSloppiness === SLOPPINESS.Architect &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <ArchitectSvg />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(SLOPPINESS.Artist);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaSloppiness === SLOPPINESS.Artist &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <ArtistSvg />
          </div>
          <div
            tabIndex={0}
            onClick={() => onClick(SLOPPINESS.Cartoonist)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaSloppiness === SLOPPINESS.Cartoonist &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <CartoonistSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
