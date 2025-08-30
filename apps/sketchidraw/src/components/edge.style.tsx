"use client";

import { ClientEvents, Edges } from "@/constants";
import { RoundEdgeSvg, SharpEdgeSvg } from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { Shape } from "@/types/shape";
import { ToolType } from "@/types/tools";

type EdgeStyleProps = {
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

export const EdgeStyle = ({
  selectedShapeId,
  isConnected,
  shapes,
  sendEncryptedMessage,
}: EdgeStyleProps) => {
  const { canvaEdge, onSetCanvaEdge, canvaShapes, onSetCanvaShapes } =
    useCanva();
  let newShapes = isConnected ? shapes : canvaShapes;

  const onClick = (edge: Edges) => {
    onSetCanvaEdge(edge);
    if (selectedShapeId !== null) {
      let shapeToUpdate = newShapes.find((s) => s.id === selectedShapeId)!;
      if (
        shapeToUpdate.type === ToolType.Rectangle ||
        shapeToUpdate.type === ToolType.Diamond
      ) {
        shapeToUpdate = {
          ...shapeToUpdate,
          edgeType: edge,
        };
      }
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
        Edges
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(Edges.Sharp);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaEdge === Edges.Sharp &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <SharpEdgeSvg />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(Edges.Round);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaEdge === Edges.Round &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <RoundEdgeSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
