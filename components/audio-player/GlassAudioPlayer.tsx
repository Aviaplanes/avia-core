"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GlassAudioPlayerProps } from "./types";
import { ControlButtons } from "./components/ControlButtons";
import { ProgressBar } from "./components/ProgressBar";
import { Volume } from "./components/Volume";

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

  // === Управление треками ===
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
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  // === Обновление времени и длительности ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.error("Play failed:", e));
      } else {
        handleNext();
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [handleNext, isDragging, isRepeat]);

  // === Переключение трека ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentSong.src;
    setCurrentTime(0);

    const handleLoad = () => {
      setDuration(audio.duration || 0);
      if (isPlaying) {
        audio.play().catch((e) => console.error("Play failed:", e));
      }
    };

    audio.addEventListener("loadedmetadata", handleLoad);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoad);
    };
  }, [currentSong, isPlaying]);

  // === Управление громкостью ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // === Прогресс-бар: drag & click ===
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | MouseEvent,
  ) => {
    if (!isDragging) return;
    const progressContainer = progressRef.current;
    if (!progressContainer) return;

    const rect = progressContainer.getBoundingClientRect();
    let newTime = ((e.clientX - rect.left) / rect.width) * duration;
    newTime = Math.max(0, Math.min(duration, newTime));
    setDragTime(newTime);
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
    const progressContainer = progressRef.current;
    const audio = audioRef.current;
    if (!progressContainer || !audio) return;

    const rect = progressContainer.getBoundingClientRect();
    let newTime = ((e.clientX - rect.left) / rect.width) * duration;
    newTime = Math.max(0, Math.min(duration, newTime));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragTime, duration]);

  // === Громкость ===
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

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
      style={{ width: "640px", height: "63px" }}
    >
      {/* SVG фильтры */}
      <svg colorInterpolationFilters="sRGB" style={{ display: "none" }}>
        <defs>
          
          <filter id="mixed-ui-player-filter">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="1.5"
              result="blurred_source"
            />
            <feImage
              href="/images/displacement-map-yr2eh1.png"
              x="0"
              y="0"
              width="640"
              height="63"
              result="displacement_map"
            />
            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              scale="120"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix
              in="displaced"
              type="saturate"
              result="displaced_saturated"
              values="9"
            />
            <feImage
              href="/images/specular-map-yr2eh1.png"
              x="0"
              y="0"
              width="640"
              height="63"
              result="specular_layer"
            />
            <feComposite
              in="displaced_saturated"
              in2="specular_layer"
              operator="in"
              result="specular_saturated"
            />
            <feComponentTransfer in="specular_layer" result="specular_faded">
              <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
            <feBlend
              in="specular_saturated"
              in2="displaced"
              mode="normal"
              result="withSaturation"
            />
            <feBlend in="specular_faded" in2="withSaturation" mode="normal" />
          </filter>
          
        </defs>
      </svg>

      {/* Основной контейнер с эффектом стекла */}
      <div
        className="absolute inset-0 bg-[var(--glass-rgb)]/[var(--glass-bg-alpha)]"
        style={{
          borderRadius: "34px",
          backdropFilter: 'url("#mixed-ui-player-filter")',
        }}
      />

      {/* Контейнер с элементами управления */}
      <div
        className="pointer-events-auto absolute inset-0 flex items-center gap-4 px-6"
        style={{ borderRadius: "34px" }}
      >
        <ControlButtons
          isPlaying={isPlaying}
          isRepeat={isRepeat}
          onPlayPause={togglePlayPause}
          onPrev={handlePrev}
          onNext={handleNext}
          onRepeat={toggleRepeat}
        />

        <ProgressBar
          song={currentSong}
          progressRef={progressRef}
          currentTime={currentTime}
          duration={duration}
          dragTime={dragTime}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onClick={handleClickProgress}
        />

        <Volume isMuted={isMuted} volume={volume} onToggleMute={toggleMute} />
      </div>

      {/* Скрытый audio элемент */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default GlassAudioPlayer;
