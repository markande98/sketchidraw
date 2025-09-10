"use client";

import { CanvaModalType, FontFamily } from "@/constants";
import { useCanva } from "@/hooks/use-canva-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useE2EWebsocket } from "@/hooks/use-e2e-websocket";
import { useInfiniteCanvas } from "@/hooks/use-infinite-canvas";
import { cn, getFontCSS, saveToLocalStorage } from "@/lib/utils";
import { Shape } from "@/types/shape";
import { ToolType } from "@/types/tools";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasProperty } from "../canvas-property";
import { CanvasZoom } from "../canvas-zoom";
import { UsersShareIcon } from "../users-share-icon";
import { WelcomeScreen } from "../welcome-screen";
import { CanvaClearModal } from "./canva-clear-modal";
import { CanvaCollabModal } from "./canva-collab-modal";
import { CanvaShareModal } from "./canva-share-modal";
import { CanvasBoard } from "./canvas-board";
import { CanvasMenu } from "./canvas-Menu";
import { ToolsMenu } from "./tools-menu";
import { CanvasShieldIcon } from "../canvas-shield-icon";
import { useMediaQuery } from "use-media-query-react";
import { ShareSvgIcon } from "@/constants/svg";

export const CanvasView = () => {
  const isShareIcon = useMediaQuery("(max-width:978px)");
  const { resolvedTheme } = useTheme();
  const [hash, setHash] = useState("");
  const { currentUser, isAuthenticated } = useCurrentUser();
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const { tooltype, canvaShapes, onSetCanvaShapes, onOpen } = useCanva();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    expandCanvasForPanning,
    setCanvasState,
    zoomIn,
    zoomOut,
    resetZoom,
    panX,
    panY,
  } = useInfiniteCanvas({ canvasRef });

  const { isConnected, wsRef, roomData, users, shapes, sendEncryptedMessage } =
    useE2EWebsocket({
      hash,
      currentUser,
    });

  const handleClick = useCallback(() => {
    if (!currentUser || !isAuthenticated) {
      redirect("/auth/signin");
      return;
    }
    if (hash.startsWith("#room=")) {
      const url = `${window.location.origin}/${hash}`;
      onOpen(CanvaModalType.Share, url);
      return;
    }
    onOpen(CanvaModalType.Session, null);
  }, [onOpen, isAuthenticated, currentUser, hash]);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    setSelectedShapeId(null);
    if (isConnected) {
      return;
    }
    const hasShapes = localStorage.getItem("sketchidraw");
    if (hasShapes) {
      const shapes: Shape[] = JSON.parse(hasShapes);
      onSetCanvaShapes(shapes);
    }
  }, [onSetCanvaShapes, isConnected]);

  useEffect(() => {
    saveToLocalStorage(canvaShapes);
  }, [canvaShapes]);

  useEffect(() => {
    if (!currentUser) return;

    const drawUserCursorPos = (
      id: string,
      username: string,
      cursorPos: { x: number; y: number }
    ) => {
      // Remove existing div if it exists
      const existingDiv = document.getElementById(id);
      if (existingDiv) {
        existingDiv.remove();
      }

      const div = document.createElement("div");
      div.id = id;
      div.innerText = username;

      // Apply styles directly to style properties
      div.style.position = "absolute";
      div.style.left = `${cursorPos.x}px`;
      div.style.top = `${cursorPos.y}px`;
      div.style.backgroundColor = resolvedTheme === "dark" ? "white" : "black";
      div.style.color = resolvedTheme === "dark" ? "black" : "white";
      div.style.fontFamily = getFontCSS(FontFamily.SketchiFont);
      div.style.fontSize = "14px";
      div.style.fontWeight = "800";
      div.style.zIndex = "100";
      div.style.pointerEvents = "none"; // Prevent interference with mouse events
      div.style.padding = "2px";
      div.style.borderRadius = "3px";

      // Create and position the cursor SVG
      const cursorSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      cursorSvg.style.position = "absolute";
      cursorSvg.style.left = "-15px"; // Top-left corner
      cursorSvg.style.top = "-20px"; // Top-left corner
      cursorSvg.style.width = "20px";
      cursorSvg.style.height = "20px";
      cursorSvg.style.rotate = "15deg";
      cursorSvg.style.pointerEvents = "none";
      cursorSvg.style.zIndex = "101"; // Higher than the div

      // Add your cursor path/shape here
      cursorSvg.innerHTML = `
        <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
        fill=${resolvedTheme === "dark" ? "white" : "black"}
        stroke=${resolvedTheme === "dark" ? "black" : "white"}
        stroke-width="1"/>
      `;

      // Append cursor to the div
      div.appendChild(cursorSvg);

      document.body.appendChild(div);
    };

    users.forEach((user) => {
      if (user.id !== currentUser.id) {
        drawUserCursorPos(user.id, user.username, user.cursorPos);
      }
    });

    return () => {
      users.forEach((user) => {
        const div = document.getElementById(user.id);
        if (div) {
          div.remove();
        }
      });
    };
  }, [currentUser, users, resolvedTheme]);

  const showWelcomeScreen =
    tooltype === ToolType.Select && canvaShapes.length === 0;

  return (
    <div className="min-h-screen overflow-hidden dark:bg-surface-lowest relative">
      {!isConnected && showWelcomeScreen && <WelcomeScreen />}
      <CanvaClearModal setSelectedShapeId={setSelectedShapeId} />
      <CanvaCollabModal />
      <CanvaShareModal wsRef={wsRef} roomId={roomData?.roomId} />
      <CanvasProperty
        isConnected={isConnected}
        shapes={shapes}
        canvasRef={canvasRef}
        selectedShapeId={selectedShapeId}
        sendEncryptedMessage={sendEncryptedMessage}
      />
      <CanvasMenu
        isConnected={isConnected}
        shapes={shapes}
        canvasRef={canvasRef}
        selectedShapeId={selectedShapeId}
        sendEncryptedMessage={sendEncryptedMessage}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
      />
      <ToolsMenu />
      {isConnected && <UsersShareIcon users={users} />}
      <button
        onClick={handleClick}
        type="button"
        className={cn(
          "hidden sm:block absolute z-[100] right-6 top-6 h-10 text-xs bg-primary border-primary hover:bg-primary-darker hover:border-primary-darker shadow-md p-3 rounded-md cursor-pointer font-normal text-surface-lowest",
          isConnected && "bg-[#0fb884] hover:bg-[#0fb884] border-[#0fb884]"
        )}
      >
        {isShareIcon ? <ShareSvgIcon /> : "Share"}
        {isConnected && (
          <div className="h-4 w-4 flex items-center justify-center -right-1 p-[3px] rounded-full absolute bg-[#b2f2bb] text-[#2b8a3e]">
            {users.length}
          </div>
        )}
      </button>
      <CanvasZoom zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />
      <CanvasShieldIcon />
      <CanvasBoard
        panX={panX}
        panY={panY}
        canvasRef={canvasRef}
        selectedShapeId={selectedShapeId}
        isConnected={isConnected}
        wsRef={wsRef}
        roomData={roomData}
        shapes={shapes}
        sendEncryptedMessage={sendEncryptedMessage}
        setSelectedShapeId={setSelectedShapeId}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        handleWheel={handleWheel}
        setCanvasState={setCanvasState}
        expandCanvasForPanning={expandCanvasForPanning}
      />
    </div>
  );
};
