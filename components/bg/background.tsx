// src/components/bg/background.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ControlsProvider } from './bg-controls/controls';

interface Props {
  folder?: string;
  overlay?: number;
  minWidth?: number;
  children?: React.ReactNode;
}

export const Background = ({ 
  folder = '/footage', 
  overlay = 0.4,
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

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= minWidth);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [minWidth]);

  useEffect(() => {
    if (!isDesktop) return;
    fetch(`/api/videos?folder=${folder}`)
      .then(res => res.json())
      .then(data => setVideos(data.videos));
  }, [folder, isDesktop]);

  useEffect(() => {
    if (!videoRef.current || !videos.length) return;

    videoRef.current.src = videos[current];
    videoRef.current.load();

    if (isPlayingRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [current, videos]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
  }, [volume]);

  const next = useCallback(
    () => setCurrent(prev => (prev + 1) % videos.length), 
    [videos.length]
  );
  
  const prev = useCallback(
    () => setCurrent(prev => (prev - 1 + videos.length) % videos.length), 
    [videos.length]
  );

  // Синхронизация с реальным состоянием видео
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Toggle теперь смотрит на реальное состояние видео
  const toggle = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    // Стейт обновится через onPlay/onPause
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (v > 0 && isMuted) setIsMuted(false);
    if (v === 0) setIsMuted(true);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

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