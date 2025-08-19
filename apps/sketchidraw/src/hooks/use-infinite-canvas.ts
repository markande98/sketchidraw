"use client";

import { RefObject, useCallback, useRef, useState } from "react";

interface CanvasState {
  scale: number;
  panX: number;
  panY: number;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

interface Touch {
  x: number;
  y: number;
  startTime: number;
}

type InfiniteCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export const useInfiniteCanvas = ({ canvasRef }: InfiniteCanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    panX: 0,
    panY: 0,
    bounds: {
      minX: -10000,
      minY: -10000,
      maxX: 10000,
      maxY: 10000,
    },
  });

  const [isPanning, setIsPanning] = useState(false);
  // const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isMultitouch, setIsMultitouch] = useState(false);

  const lastPointerPos = useRef({ x: 0, y: 0 });
  const startPanPos = useRef({ x: 0, y: 0 });
  const touchesMap = useRef<Map<number, Touch>>(new Map());
  const lastTouchDistance = useRef(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  const { scale, panX, panY } = canvasState;

  console.log(scale, panX, panY);
  const zoomAt = useCallback(
    (mouseX: number, mouseY: number, factor: number) => {
      const minScale = 0.05; // 5%
      const maxScale = 2.0; // 200%
      const newScale = Math.max(minScale, Math.min(maxScale, scale * factor));

      if (newScale !== scale) {
        const canvasX = (mouseX - panX) / scale;
        const canvasY = (mouseY - panY) / scale;

        const newPanX = mouseX - canvasX * newScale;
        const newPanY = mouseY - canvasY * newScale;

        setCanvasState((prev) => ({
          ...prev,
          scale: newScale,
          panX: newPanX,
          panY: newPanY,
        }));
      }
    },
    [panX, panY, scale]
  );

  const zoomAtCenter = useCallback(
    (centerX: number, centerY: number, factor: number) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const canvasRelativeX = centerX - rect.left;
      const canvasRelativeY = centerY - rect.top;

      zoomAt(canvasRelativeX, canvasRelativeY, factor);
    },
    [canvasRef, zoomAt]
  );

  const expandCanvasForPanning = useCallback(() => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const visibleLeft = -panX / scale;
    const visibleTop = -panY / scale;
    const visibleRight = (rect.width - panX) / scale;
    const visibleBottom = (rect.height - panY) / scale;

    const expansionBuffer = 5000;

    setCanvasState((prev) => ({
      ...prev,
      bounds: {
        minX: Math.min(prev.bounds.minX, visibleLeft - expansionBuffer),
        minY: Math.min(prev.bounds.minY, visibleTop - expansionBuffer),
        maxX: Math.max(prev.bounds.maxX, visibleRight + expansionBuffer),
        maxY: Math.max(prev.bounds.maxY, visibleBottom + expansionBuffer),
      },
    }));
  }, [panX, panY, scale, canvasRef]);

  const updateTouchGesture = useCallback(() => {
    const touchArray = Array.from(touchesMap.current.values());
    if (touchArray.length < 2) return;

    const touch1 = touchArray[0];
    const touch2 = touchArray[1];

    const center = {
      x: (touch1.x + touch2.x) / 2,
      y: (touch1.y + touch2.y) / 2,
    };

    const distance = Math.sqrt(
      Math.pow(touch1.x - touch2.x, 2) + Math.pow(touch1.y - touch2.y, 2)
    );

    if (
      lastTouchDistance.current > 0 &&
      Math.abs(distance - lastTouchDistance.current) > 1
    ) {
      const zoomFactor = distance / lastTouchDistance.current;
      const smoothZoomFactor = 1 + (zoomFactor - 1) * 0.15;
      zoomAtCenter(center.x, center.y, smoothZoomFactor);
    }
    if (lastTouchCenter.current.x !== 0 && lastTouchCenter.current.y !== 0) {
      const panDeltaX = center.x - lastTouchCenter.current.x;
      const panDeltaY = center.y - lastTouchCenter.current.y;

      if (Math.abs(panDeltaX) > 1 || Math.abs(panDeltaY) > 1) {
        setCanvasState((prev) => ({
          ...prev,
          panX: prev.panX + panDeltaX,
          panY: prev.panY + panDeltaY,
        }));
        expandCanvasForPanning();
      }
    }
    lastTouchDistance.current = distance;
    lastTouchCenter.current = center;
  }, [expandCanvasForPanning, zoomAtCenter]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const isPinchZoom = e.ctrlKey || e.metaKey;

      if (isPinchZoom) {
        let zoomDelta = -e.deltaY * 0.001;
        zoomDelta = Math.max(-0.1, Math.min(0.1, zoomDelta));
        const zoomFactor = 1 + zoomDelta;

        zoomAt(mouseX, mouseY, zoomFactor);
      } else {
        const panSensitivity = Math.max(0.5, 1.2 / scale);

        setCanvasState((prev) => ({
          ...prev,
          panX: prev.panX - e.deltaX * panSensitivity,
          panY: prev.panY - e.deltaY * panSensitivity,
        }));

        expandCanvasForPanning();
      }
    },
    [canvasRef, expandCanvasForPanning, zoomAt, scale]
  );

  const handleTouchStart = useCallback(
    (
      touches: Array<{ identifier: number; clientX: number; clientY: number }>,
      preventDefault: () => void
    ) => {
      preventDefault();

      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        touchesMap.current.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY,
          startTime: Date.now(),
        });
      }

      if (touchesMap.current.size >= 2) {
        setIsMultitouch(true);
        setIsPanning(false);
        lastTouchDistance.current = 0;
        lastTouchCenter.current = { x: 0, y: 0 };
        updateTouchGesture();
      } else {
        setIsMultitouch(false);
        setIsPanning(true);

        const touch = touches[0];
        lastPointerPos.current = { x: touch.clientX, y: touch.clientY };
        startPanPos.current = { x: panX, y: panY };
      }
    },
    [panX, panY, updateTouchGesture]
  );

  const handleTouchMove = useCallback(
    (
      touches: Array<{ identifier: number; clientX: number; clientY: number }>,
      preventDefault: () => void
    ) => {
      preventDefault();

      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        if (touchesMap.current.has(touch.identifier)) {
          touchesMap.current.set(touch.identifier, {
            x: touch.clientX,
            y: touch.clientY,
            startTime:
              touchesMap.current.get(touch.identifier)?.startTime || Date.now(),
          });
        }
      }

      if (isMultitouch && touchesMap.current.size >= 2) {
        updateTouchGesture();
      } else if (isPanning && touchesMap.current.size === 1) {
        const touch = touches[0];
        const deltaX = touch.clientX - lastPointerPos.current.x;
        const deltaY = touch.clientY - lastPointerPos.current.y;

        setCanvasState((prev) => ({
          ...prev,
          panX: startPanPos.current.x + deltaX,
          panY: startPanPos.current.y + deltaY,
        }));

        expandCanvasForPanning();
      }
    },
    [isMultitouch, isPanning, updateTouchGesture, expandCanvasForPanning]
  );

  const handleTouchEnd = useCallback(
    (
      touches: Array<{ identifier: number; clientX: number; clientY: number }>,
      preventDefault: () => void
    ) => {
      preventDefault();

      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        touchesMap.current.delete(touch.identifier);
      }

      if (touchesMap.current.size < 2) {
        setIsMultitouch(false);
        lastTouchDistance.current = 0;
        lastTouchCenter.current = { x: 0, y: 0 };
      }

      if (touchesMap.current.size === 1) {
        setIsPanning(false);
      }
    },
    []
  );

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    scale,
    panX,
    panY,
  };
};
