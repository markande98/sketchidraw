"use client";

import { CanvaModalType, FontFamily } from "@/constants";
import { useCanva } from "@/hooks/use-canva-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getFontCSS, hexToRgba } from "@/lib/utils";
import { LogIn, LogOut, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const welcomeText = [
  {
    type: "middle",
    text: "Pick a tool &\nStart drawing!",
    lineHeight: 1.2,
    fontSize: 16,
    fontFamily: getFontCSS(FontFamily.SketchiFont),
    color: hexToRgba("#a3a3a3"),
  },
  {
    type: "start",
    text: "Export, preferences, languages, ...",
    lineHeight: 1.2,
    fontSize: 16,
    fontFamily: getFontCSS(FontFamily.SketchiFont),
    color: hexToRgba("#a3a3a3"),
  },
];

export const WelcomeScreen = () => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { canvas, onOpen } = useCanva();
  const [mounted, setMounted] = useState(false);

  const drawBezierArrow = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    endX: number,
    startY: number,
    endY: number,
    curve: number = 40
  ) => {
    const cp1X = startX + curve;
    const cp1Y = startY - curve / 2;
    const cp2X = endX;
    const cp2Y = endY;

    // Draw the curved line

    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    ctx.stroke();

    ctx.fillStyle = "#999999";
    ctx.beginPath();
    ctx.moveTo(endX, endY - 20);
    ctx.lineTo(endX + 10, endY);
    ctx.lineTo(endX - 10, endY);
    ctx.fill();
  };

  const handleClick = async () => {
    if (currentUser) {
      await signOut({
        callbackUrl: "/auth/signin",
      });
      return;
    }
    router.push("/auth/signup");
  };

  const modalClick = useCallback(
    (modalType: CanvaModalType) => {
      if (modalType === CanvaModalType.Clear) {
        onOpen(modalType, null);
        return;
      }
      const hash = window.location.hash;
      if (hash) {
        const url = `${window.location.origin}/${hash}`;
        onOpen(CanvaModalType.Share, url);
        return;
      }
      onOpen(CanvaModalType.Session, null);
    },
    [onOpen]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.fonts.ready.then(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < welcomeText.length; i++) {
        const txt = welcomeText[i];
        if (txt.type === "start" && window.innerWidth < 900) continue;
        if (txt.type === "middle" && window.innerWidth < 640) continue;
        if (window.innerHeight < 540) continue;
        const lines = txt.text.split("\n");
        const lineHeight = txt.fontSize * txt.lineHeight;

        ctx.font = `bold ${txt.fontSize}px ${txt.fontFamily}, Arial, sans-serif`;
        ctx.fillStyle = txt.color;

        let x: number;
        let y: number;
        switch (txt.type) {
          case "middle":
            x = canvas.width / 2 - 80;
            y = 130;
            drawBezierArrow(ctx, x + 120, x + 155, y + 20, y - 30);
            break;
          case "start":
            x = 80;
            y = 120;
            drawBezierArrow(ctx, x - 5, x - 35, y + 10, y - 40, -20);
            break;
          default:
            break;
        }
        lines.forEach((line, index) => {
          const _y = y + index * lineHeight + txt.fontSize;
          ctx.fillText(line, x, _y);
        });
      }
    });

    const handleResize = () => {
      document.fonts.ready.then(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < welcomeText.length; i++) {
          const txt = welcomeText[i];
          if (txt.type === "start" && window.innerWidth < 900) continue;
          if (txt.type === "middle" && window.innerWidth < 640) continue;
          if (window.innerHeight < 540) continue;
          const lines = txt.text.split("\n");
          const lineHeight = txt.fontSize * txt.lineHeight;

          ctx.font = `bold ${txt.fontSize}px ${txt.fontFamily}, Arial, sans-serif`;
          ctx.fillStyle = txt.color;

          let x: number;
          let y: number;
          switch (txt.type) {
            case "middle":
              x = canvas.width / 2 - 80;
              y = 130;
              drawBezierArrow(ctx, x + 120, x + 155, y + 20, y - 30);
              break;
            case "start":
              x = 80;
              y = 120;
              drawBezierArrow(ctx, x - 5, x - 35, y + 10, y - 40, -20);
              break;
            default:
              break;
          }
          lines.forEach((line, index) => {
            const _y = y + index * lineHeight + txt.fontSize;
            ctx.fillText(line, x, _y);
          });
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [canvas]);

  if (!mounted) return null;
  return (
    <div className="absolute z-[100] inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4 mt-20">
        <div className="flex items-center gap-4 mb-10">
          <Image
            width={50}
            height={50}
            src="/images/sketchidraw.svg"
            alt="logo"
          />
          <h1 className="text-5xl font-extrabold text-logo-text font-sketchifont tracking-tighter">
            SKETCHIDRAW
          </h1>
        </div>
        <div className="flex items-center">
          <p className="text-[#999999] font-sketchifont text-xl">
            All your data is saved locally in your browser
          </p>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <div
            onClick={() => modalClick(CanvaModalType.Session)}
            className="w-74 flex items-center gap-2 cursor-pointer p-3 rounded-md text-[#999999] hover:bg-surface-primary-container/50 dark:hover:bg-surface-high hover:text-on-surface transition duration-150"
          >
            <Users size={14} />
            <p className="text-sm">Live collaboration...</p>
          </div>
          <div
            onClick={handleClick}
            className="w-74 flex items-center gap-2 cursor-pointer p-3 rounded-md text-[#999999] hover:bg-surface-primary-container/50 dark:hover:bg-surface-high hover:text-on-surface transition duration-150"
          >
            {currentUser && (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <LogOut size={14} />
                  <p className="text-sm">Sign out</p>
                </div>
                <p className="text-sm">{currentUser.username}</p>
              </div>
            )}
            {!currentUser && (
              <>
                <LogIn size={14} />
                <p className="text-sm">Sign up</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
