// src/components/bg/background.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ControlsProvider } from './bg-controls/controls';

const VIDEO_LIST = [
  '/footage/Comp 1_11.mp4',
  '/footage/eraserhead.mp4',
  '/footage/gat.mp4',
  '/footage/ggg.mp4',
  '/footage/IVOXYGEN - the girl next door.webm',
  '/footage/Jordan Barrett DANCE - SMOKE IT OFF - SLOWED.mp4',
  '/footage/lauren.mp4',
  '/footage/pip.mp4',
  '/footage/rjaviy.mp4',
  '/footage/soundss.mp4',
  '/footage/urban.mp4',
];

interface Props {
  overlay?: number;
  minWidth?: number;
  children?: React.ReactNode;
}

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const Background = ({ 
  overlay = 0.25,
  minWidth = 768,
  children
}: Props) => {
  const [videos, setVideos] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlayingRef = useRef(isPlaying);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= minWidth);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [minWidth]);

  useEffect(() => {
    if (!isDesktop) return;
    setVideos(shuffle(VIDEO_LIST));
  }, [isDesktop]);

  useEffect(() => {
    if (!videoRef.current || !videos.length) return;

    const video = videoRef.current;
    video.src = videos[current];
    video.load();

    if (isPlayingRef.current) {
      // Сохраняем текущее состояние muted
      const wasMuted = isMutedRef.current;
      
      video.play().catch(() => {
        // Если не получилось — мутим ТОЛЬКО для первого autoplay
        // и только если раньше не было unmuted
        if (wasMuted) {
          video.muted = true;
          video.play().catch(() => {});
        }
        // Если юзер уже включил звук — не мутим, просто не играем
      });
    }
  }, [current, videos]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = isMuted;
  }, [volume, isMuted]);

  const next = useCallback(
    () => setCurrent(prev => (prev + 1) % videos.length), 
    [videos.length]
  );
  
  const prev = useCallback(
    () => setCurrent(prev => (prev - 1 + videos.length) % videos.length), 
    [videos.length]
  );

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (v > 0 && isMuted) setIsMuted(false);
    if (v === 0) setIsMuted(true);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  if (!isDesktop || !videos.length) return <>{children}</>;

  return (
    <ControlsProvider 
      onNext={next} 
      onPrev={prev} 
      onToggle={toggle} 
      isPlaying={isPlaying}
      volume={volume}
      onVolumeChange={handleVolumeChange}
      isMuted={isMuted}
      onToggleMute={toggleMute}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={next}
        onPlay={handlePlay}
        onPause={handlePause}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -2,
        }}
      />
      
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        background: `rgba(0,0,0,${overlay})`,
        zIndex: -1 
      }} />

      {children}
    </ControlsProvider>
  );
};