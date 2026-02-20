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

function shuffleArrayKeepFirst<T>(array: T[]): T[] {
  if (array.length <= 1) return array;
  const [first, ...rest] = [...array];
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shuffledVideos, setShuffledVideos] = useState<string[]>(videoList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.2);
  const [prevVolume, setPrevVolume] = useState(0.2);
  const [isPaused, setIsPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setShuffledVideos(shuffleArrayKeepFirst(videoList));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume ** 2;
      videoRef.current.muted = isMuted;

      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, isMuted, volume, isPaused]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleVideoEnd = () => {
    if (currentIndex + 1 < shuffledVideos.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShuffledVideos(shuffleArrayKeepFirst(videoList));
      setCurrentIndex(0);
    }
  };

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
    setCurrentIndex(
      (prev) => (prev - 1 + shuffledVideos.length) % shuffledVideos.length,
    );

  const nextVideo = () =>
    setCurrentIndex((prev) => (prev + 1) % shuffledVideos.length);



  return (
    <div>
      {!isMobile && (
        <video
          ref={videoRef}
          src={shuffledVideos[currentIndex]}
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={handleVideoEnd}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: -1,
          }}
        />
      )}

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
        {!isMobile && (
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
        )}
      </div>
    </div>
  );
};

export default BackgroundVideo;
