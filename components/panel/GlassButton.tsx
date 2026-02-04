"use client";

import React, { useState, useCallback } from "react";

interface GlassButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  size?: number;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  onClick,
  children,
  size = 50,
  ariaLabel,
  className,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback(() => {
    if (!disabled) setIsPressed(true);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    if (!disabled) setIsPressed(true);
  }, [disabled]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  // iOS 26 style calculations
  const scale = isPressed ? 0.88 : isHovered ? 1.05 : 1;
  const backgroundOpacity = isPressed ? 0.18 : isHovered ? 0.12 : 0.08;
  const borderOpacity = isPressed ? 0.25 : isHovered ? 0.18 : 0.1;
  const glowOpacity = isHovered && !isPressed ? 0.15 : 0;
  const innerShadowOpacity = isPressed ? 0.1 : 0;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        opacity: disabled ? 0.5 : 1,
        transform: `scale(${scale})`,
        transition: `
          transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
          opacity 0.2s ease
        `,
        overflow: "visible",
        WebkitTapHighlightColor: "transparent",
        outline: "none",
      }}
    >
      {/* Outer glow - iOS 26 hover effect */}
      <div
        style={{
          position: "absolute",
          inset: `-${size * 0.1}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255, 255, 255, ${glowOpacity}) 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Main background with dynamic opacity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          transition: `
            background-color 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease
          `,
          boxShadow: isPressed
            ? `inset 0 2px 8px rgba(0, 0, 0, ${innerShadowOpacity})`
            : isHovered
              ? `0 4px 20px rgba(255, 255, 255, 0.08)`
              : "none",
          pointerEvents: "none",
        }}
      />

      {/* Shimmer effect on hover - iOS 26 style */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `linear-gradient(
            135deg,
            rgba(255, 255, 255, ${isHovered && !isPressed ? 0.1 : 0}) 0%,
            transparent 50%,
            rgba(255, 255, 255, ${isHovered && !isPressed ? 0.05 : 0}) 100%
          )`,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Content with subtle movement */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isPressed ? "translateY(1px)" : "translateY(0)",
          transition: "transform 0.2s ease",
          opacity: isPressed ? 0.9 : 1,
        }}
      >
        {children}
      </div>
    </button>
  );
};

export default GlassButton;
