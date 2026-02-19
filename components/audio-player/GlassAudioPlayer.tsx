"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GlassAudioPlayerProps } from "./types";
import { ControlButtons } from "./components/ControlButtons";
import { ProgressBar } from "./components/ProgressBar";
import { Volume } from "./components/Volume";

const FILTER_ID = "mixed-ui-player-filter";
const DISPLACEMENT_MAP = "/images/displacement-map-yr2eh1.png";
const SPECULAR_MAP = "/images/specular-map-yr2eh1.png";
const PLAYER_W = 640;
const PLAYER_H = 63;

function useBackdropFilterWarmup(filterId: string, imageSrcs: string[]) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;

    const preload = imageSrcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        }),
    );

    Promise.all(preload).then(() => {
      if (cancelled) return;

      requestAnimationFrame(() => {
        if (cancelled) return;
        const filterUrl = `url("#${filterId}")`;
        el.style.backdropFilter = filterUrl;
        (el.style as any).webkitBackdropFilter = filterUrl;
        void el.offsetHeight;

        requestAnimationFrame(() => {
          if (cancelled) return;
          el.style.transform = "translateZ(0)";
          void el.offsetHeight;
          el.style.transform = "";
        });
      });
    });

    return () => { cancelled = true; };
  }, [filterId, imageSrcs]);

  return ref;
}

export const GlassAudioPlayer = ({
  songs,
  initialSongIndex = 0,
}: GlassAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.25);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const MIN_VOLUME = 0.4;
  const currentSong = songs[currentSongIndex];

  const backdropRef = useBackdropFilterWarmup(
    FILTER_ID,
    [DISPLACEMENT_MAP, SPECULAR_MAP],
  );

  const handleNext = useCallback(() => {
    setCurrentSongIndex((prev) => (prev < songs.length - 1 ? prev + 1 : 0));
  }, [songs.length]);

  const handlePrev = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
    } else {
      setCurrentSongIndex((prev) => (prev > 0 ? prev - 1 : songs.length - 1));
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch((e) => console.error("Play failed:", e));
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onMeta = () => setDuration(audio.duration || 0);
    const onTime = () => { if (!isDragging) setCurrentTime(audio.currentTime); };
    const onEnd = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.error("Play failed:", e));
      } else {
        handleNext();
      }
    };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [handleNext, isDragging, isRepeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentSong.src;
    setCurrentTime(0);

    const onLoad = () => {
      setDuration(audio.duration || 0);
      if (isPlaying) audio.play().catch((e) => console.error("Play failed:", e));
    };
    audio.addEventListener("loadedmetadata", onLoad);
    return () => audio.removeEventListener("loadedmetadata", onLoad);
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!isDragging) return;
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragTime(Math.max(0, Math.min(duration, ((e.clientX - rect.left) / rect.width) * duration)));
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (audioRef.current && dragTime !== null) {
      audioRef.current.currentTime = dragTime;
      setCurrentTime(dragTime);
    }
    setIsDragging(false);
    setDragTime(null);
  };

  const handleClickProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect();
    const audio = audioRef.current;
    if (!rect || !audio) return;
    const t = Math.max(0, Math.min(duration, ((e.clientX - rect.left) / rect.width) * duration));
    audio.currentTime = t;
    setCurrentTime(t);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragTime, duration]);

  const toggleMute = () => {
    if (isMuted || volume === 0) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : MIN_VOLUME);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div
      className="pointer-events-none absolute left-1/2 bottom-6 -translate-x-1/2 z-10"
      style={{ width: `${PLAYER_W}px`, height: `${PLAYER_H}px` }}
    >
      {/* SVG: не display:none, а нулевые размеры — чтобы браузер грузил feImage */}
      <svg
        aria-hidden="true"
        focusable="false"
        colorInterpolationFilters="sRGB"
        className="absolute overflow-hidden pointer-events-none"
        style={{ width: 0, height: 0 }}
      >
        <defs>
          {/* filterUnits и primitiveUnits НЕ заданы — используются дефолты:
              filterUnits="objectBoundingBox" (даёт 10% margin — нет обрезки)
              primitiveUnits="userSpaceOnUse" (пиксельные координаты в feImage) */}
          <filter id={FILTER_ID}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurred_source" />
            <feImage
              href={DISPLACEMENT_MAP}
              preserveAspectRatio="none"
              x="0" y="0" width={PLAYER_W} height={PLAYER_H}
              result="displacement_map"
            />
            <feDisplacementMap
              in="blurred_source" in2="displacement_map"
              scale="210" xChannelSelector="R" yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix in="displaced" type="saturate" values="9" result="displaced_saturated" />
            <feImage
              href={SPECULAR_MAP}
              preserveAspectRatio="none"
              x="0" y="0" width={PLAYER_W} height={PLAYER_H}
              result="specular_layer"
            />
            <feComposite
              in="displaced_saturated" in2="specular_layer"
              operator="in" result="specular_saturated"
            />
            <feComponentTransfer in="specular_layer" result="specular_faded">
              <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
            <feBlend in="specular_saturated" in2="displaced" mode="normal" result="withSaturation" />
            <feBlend in="specular_faded" in2="withSaturation" mode="normal" />
          </filter>
        </defs>
      </svg>

      {/* Backdrop: начинает с blur(20px), хук переключит на SVG-фильтр */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[var(--glass-rgb)]/[var(--glass-bg-alpha)]"
        style={{
          borderRadius: "34px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          willChange: "backdrop-filter",
        }}
      />

      <div
        className="pointer-events-auto absolute inset-0 flex items-center gap-4 px-6"
        style={{ borderRadius: "34px" }}
      >
        <ControlButtons
          isPlaying={isPlaying} isRepeat={isRepeat}
          onPlayPause={togglePlayPause} onPrev={handlePrev}
          onNext={handleNext} onRepeat={toggleRepeat}
        />
        <ProgressBar
          song={currentSong} progressRef={progressRef}
          currentTime={currentTime} duration={duration}
          dragTime={dragTime} isDragging={isDragging}
          onMouseDown={handleMouseDown} onClick={handleClickProgress}
        />
        <Volume isMuted={isMuted} volume={volume} onToggleMute={toggleMute} />
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default GlassAudioPlayer;