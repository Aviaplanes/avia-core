"use client";

import React from "react";
import GlassButton from "./GlassButton";

interface GlassVolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  size?: number;
}

const GlassVolumeSlider: React.FC<GlassVolumeSliderProps> = ({
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  hovered,
  onHoverChange,
  size = 50,
}) => {
  const startVolumeDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const track = e.currentTarget;

    const updateVolume = (clientX: number) => {
      const rect = track.getBoundingClientRect();
      let newVolume = (clientX - rect.left) / rect.width;
      newVolume = Math.min(Math.max(newVolume, 0), 1);
      onVolumeChange(newVolume);
    };

    updateVolume(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updateVolume(moveEvent.clientX);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <>
          <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06"></path>
          <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.64 3.64 0 0 0-1.33 4.967 3.64 3.64 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.7 4.7 0 0 1-1.5-.694v1.3L2.817 9.852a2.14 2.14 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694z"></path>
        </>
      );
    } else if (volume <= 0.33) {
      return (
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88"></path>
      );
    } else if (volume <= 0.66) {
      return (
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a3 3 0 0 1 0 5.175z"></path>
      );
    } else {
      return (
        <>
          <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88"></path>
          <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127z"></path>
        </>
      );
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        isolation: "isolate",
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Невидимая область для связи слайдера и кнопки */}
      <div
        style={{
          position: "absolute",
          right: 0,
          width: `${size + 120}px`, // Кнопка + gap + слайдер
          height: `${size}px`,
          pointerEvents: hovered ? "auto" : "none",
        }}
      />

      {/* Слайдер громкости */}
      <div
        style={{
          position: "absolute",
          right: `${size + 10}px`,
          height: "39px",
          width: "100px",
          display: "flex",
          alignItems: "center",
          borderRadius: "999px",
          overflow: "hidden",
          pointerEvents: hovered ? "auto" : "none",
          cursor: "pointer",
          transform: hovered
            ? "translateX(0) scaleX(1)"
            : "translateX(30px) scaleX(0.3)",
          opacity: hovered ? 1 : 0,
          transformOrigin: "right center",
          transition: `
            transform 0.38s cubic-bezier(0.2, 0.9, 0.3, 1.05),
            opacity 0.28s ease-out
          `,
        }}
      >
        {/* Фон слайдера */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />

        {/* Трек ползунка */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "4px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.2)",
            cursor: "pointer",
            overflow: "hidden",
            zIndex: 3,
            margin: "0 12px",
          }}
          onMouseDown={startVolumeDrag}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${volume * 100}%`,
              background: "rgba(255,255,255,0.9)",
              borderRadius: "2px",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Кнопка громкости */}
      <GlassButton
        onClick={onToggleMute}
        size={size}
        ariaLabel={isMuted ? "Unmute" : "Mute"}
        className="anim-btn"
      >
        <svg
          viewBox="0 0 16 16"
          width={size * 0.5}
          height={size * 0.5}
          fill="currentColor"
        >
          {getVolumeIcon()}
        </svg>
      </GlassButton>
    </div>
  );
};

export default GlassVolumeSlider;
