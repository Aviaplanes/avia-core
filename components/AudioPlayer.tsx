"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./AudioPlayer.module.css";

interface Song {
  id: string;
  title: string;
  artist?: string;
  src: string;
  cover?: string;
  duration?: number;
}

interface AudioPlayerProps {
  songs: Song[];
  initialSongIndex?: number;
}

export default function AudioPlayer({
  songs,
  initialSongIndex = 0,
}: AudioPlayerProps) {
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

  const MIN_VOLUME = 0.4; // минимальный звук при unmute
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

  // === Обновление времени и длительности ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };
    const handleEnded = () => handleNext();

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [handleNext, isDragging]);

  // === Переключение трека ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentSong.src;

    setCurrentTime(0);
    setDuration(currentSong.duration || 0);

    if (isPlaying) audio.play().catch((e) => console.error("Play failed:", e));
  }, [currentSong]);

  // === Управление громкостью ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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

  // Клик по прогресс-бару (без drag)
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setPrevVolume(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
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
    <div className={styles.playerContainer}>
      <audio ref={audioRef} preload="metadata" />

      {/* Информация о треке */}
      <div className={styles.songInfo}>
        {currentSong.cover && (
          <img
            src={currentSong.cover}
            className={styles.cover}
            alt={currentSong.title}
          />
        )}
        <div className={styles.songText}>
          <div className={styles.songTitle}>{currentSong.title}</div>
          {currentSong.artist && (
            <div className={styles.songArtist}>{currentSong.artist}</div>
          )}
        </div>
      </div>

      {/* Прогресс-бар */}
      <div
        ref={progressRef}
        className={styles.progressContainer}
        onMouseDown={handleMouseDown}
        onClick={handleClickProgress}
      >
        <div className={styles.progressBackground} />
        <div
          className={styles.progressBar}
          style={{
            width: `${((isDragging && dragTime !== null ? dragTime : currentTime) / duration) * 100}%`,
          }}
        >
          <div className={styles.progressKnob} />
        </div>
      </div>

      {/* Время */}
      <div className={styles.timeContainer}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Кнопки управления */}
      <div className={styles.controlsContainer}>
        <button
          onClick={handlePrev}
          className={`${styles.controlButton} ${styles.iconOnlyButton}`}
          aria-label="Previous"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7z" />
          </svg>
        </button>

        <button
          onMouseDown={togglePlayPause}
          className={styles.playPauseButton}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 16 16" width="26" height="26" fill="currentColor">
              <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="26" height="26" fill="currentColor">
              <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleNext}
          className={`${styles.controlButton} ${styles.iconOnlyButton}`}
          aria-label="Next"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z" />
          </svg>
        </button>
      </div>

      {/* Громкость */}
      <div className={styles.volumeContainer}>
        <button
          onMouseDown={toggleMute}
          className={styles.volumeButton}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            {getVolumeIcon()}
          </svg>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
          style={
            {
              "--fill-width": `${(isMuted ? 0 : volume) * 100}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
