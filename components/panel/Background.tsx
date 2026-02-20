"use client";

import React, { useState, useRef, useEffect } from "react";
import GlassButton from "./GlassButton";
import GlassVolumeSlider from "./GlassVolumeSlider";
import { PlayIcon, PauseIcon, PreviousIcon, NextIcon } from "./icons";

const videoList = [
  "/videos/eraserhead.mp4",
  "/videos/urban.mp4",
  "/videos/IVOXYGEN - the girl next door.webm",
  "/videos/lauren.mp4",
  "/videos/Comp 1_11.mp4",
  "/videos/ggg.mp4",
  "/videos/soundss.mp4",
  "/videos/gat.mp4",
];

interface BackgroundVideoProps {
  initialIsMobile: boolean;
}

function shuffleArrayKeepFirst<T>(array: T[]): T[] {
  if (array.length <= 1) return array;
  
  const [first, ...rest] = array;
  const shuffled = [...rest];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return [first, ...shuffled];
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ initialIsMobile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // ← КРИТИЧНО: Серверный и клиентский рендер идентичны (videoList без shuffle)
  const [videos, setVideos] = useState<string[]>(videoList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.2);
  const [prevVolume, setPrevVolume] = useState(0.2);
  const [isPaused, setIsPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(initialIsMobile);

  // Определяем реальный размер экрана на клиенте
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ← Shuffle ПОСЛЕ маунта (первое видео остается на месте)
  useEffect(() => {
    if (!isMobile) {
      setVideos(shuffleArrayKeepFirst(videoList));
    }
  }, [isMobile]);

  // ← ЕДИНСТВЕННЫЙ "начальник" для управления плеером
  useEffect(() => {
    if (isMobile || !videoRef.current) return;

    const video = videoRef.current;
    video.volume = isMuted ? 0 : volume ** 2;
    video.muted = isMuted;

    if (isPaused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [currentIndex, isMuted, volume, isPaused, isMobile]);

  // ← Предзагрузка следующего видео в кэш
  useEffect(() => {
    if (isMobile || videos.length === 0) return;

    const nextIndex = (currentIndex + 1) % videos.length;
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;

    // Загружаем следующее и предыдущее для плавности
    fetch(videos[nextIndex]).catch(() => {});
    fetch(videos[prevIndex]).catch(() => {});
  }, [currentIndex, videos, isMobile]);

  // ← Функции ТОЛЬКО меняют state (React-way)
  const togglePause = () => setIsPaused((prev) => !prev);

  const toggleMute = () => {
    if (isMuted || volume < 0.005) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 0.05);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const prevVideo = () =>
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);

  const nextVideo = () =>
    setCurrentIndex((prev) => (prev + 1) % videos.length);

  const handleVideoEnd = () => {
    if (currentIndex + 1 < videos.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setVideos(shuffleArrayKeepFirst(videoList));
      setCurrentIndex(0);
    }
  };

  // На мобильных ничего не рендерим
  if (isMobile) {
    return null;
  }

  return (
    <>
      <video
        ref={videoRef}
        src={videos[currentIndex]}
        autoPlay
        muted={isMuted}
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          backgroundColor: "#000",
          zIndex: -1,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <div className="controls-row btn-0">
          <GlassVolumeSlider
            volume={volume}
            onVolumeChange={setVolume}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            hovered={hovered}
            onHoverChange={setHovered}
            size={50}
          />

          <GlassButton
            className="anim-btn btn-1"
            onClick={prevVideo}
            ariaLabel="Previous Video"
            size={50}
          >
            <PreviousIcon />
          </GlassButton>

          <GlassButton
            className="anim-btn btn-2"
            onClick={togglePause}
            ariaLabel={isPaused ? "Play" : "Pause"}
            size={50}
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </GlassButton>

          <GlassButton
            className="anim-btn btn-3"
            onClick={nextVideo}
            ariaLabel="Next video"
            size={50}
          >
            <NextIcon />
          </GlassButton>
        </div>
      </div>
    </>
  );
};

export default BackgroundVideo;