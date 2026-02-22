"use client";

import React, { useState, useRef, useCallback } from "react";
import styles from "../GlassButton/GlassButton.module.css";

interface GlassButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  size?: number;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  onClick,
  children,
  size,
  ariaLabel,
  className = "",
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const pressStartTime = useRef<number>(0);
  const releaseTimeout = useRef<NodeJS.Timeout | null>(null);
  const ANIMATION_DURATION = 100; // 100мс из твоего CSS

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    // Если кнопка отключена (disabled), не реагируем
    if (disabled) return;
    
    // Левая кнопка мыши (button 0) или касание экрана
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    if (releaseTimeout.current) clearTimeout(releaseTimeout.current);
    
    pressStartTime.current = Date.now();
    setIsPressed(true);
  }, [disabled]);

  const handlePointerUp = useCallback(() => {
    if (disabled) return;

    const timeHeld = Date.now() - pressStartTime.current;
    const timeLeft = ANIMATION_DURATION - timeHeld;

    if (timeLeft > 0) {
      releaseTimeout.current = setTimeout(() => {
        setIsPressed(false);
      }, timeLeft);
    } else {
      setIsPressed(false);
    }
  }, [disabled]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      // Объединяем твои классы из CSS-модуля и кастомные классы из пропсов
      className={`${styles.submitBtn} ${isPressed ? styles.pressed : ""} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp} // На случай, если свайпнули по экрану мобилки
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        // Если передан size (как в старом коде), делаем кнопку круглой/квадратной:
        ...(size ? { width: `${size}px`, height: `${size}px`, padding: 0, borderRadius: '50%' } : {})
      }}
    >
      {children}
    </button>
  );
};

export default GlassButton;