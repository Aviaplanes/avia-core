"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  isLoaded?: boolean;
}

export default function Marquee({
  text,
  speed = 30,
  className = "",
  isLoaded = true,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(speed);
  // Убрали useState для copies — он не нужен

  const calculateCopies = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const tempSpan = document.createElement("span");
    tempSpan.style.visibility = "hidden";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.textContent = text;
    document.body.appendChild(tempSpan);
    const singleWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    const containerWidth = container.offsetWidth;

    const neededCopies = Math.ceil((containerWidth * 3) / singleWidth) + 2;
    const finalCopies = Math.max(neededCopies, 4);

    // Просто используем finalCopies локально, не сохраняем в state
    const animDuration = (singleWidth / 50) * (speed / 30);
    setDuration(animDuration);

    content.textContent = text.repeat(finalCopies * 2);
    setIsReady(true);
  }, [text, speed]);

  useEffect(() => {
    calculateCopies();

    window.addEventListener("resize", calculateCopies);
    return () => window.removeEventListener("resize", calculateCopies);
  }, [calculateCopies]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{
        opacity: isLoaded && isReady ? 1 : 0,
        transition: "opacity 1s ease-out",
        transitionDelay: "0.8s",
      }}
    >
      <div
        ref={contentRef}
        className="inline-block whitespace-nowrap will-change-transform"
        style={{
          animation: isReady ? `marquee ${duration}s linear infinite` : "none",
        }}
      />

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
