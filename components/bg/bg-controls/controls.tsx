// src/components/bg/bg-controls/controls.tsx
'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';

interface ControlsContextType {
  next: () => void;
  prev: () => void;
  toggle: () => void;
  isPlaying: boolean;
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const ControlsContext = createContext<ControlsContextType | null>(null);

export const useControls = () => {
  return useContext(ControlsContext);
};

interface ProviderProps {
  children: ReactNode;
  onNext: () => void;
  onPrev: () => void;
  onToggle: () => void;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (v: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ControlsProvider = ({ 
  children, onNext, onPrev, onToggle, isPlaying,
  volume, onVolumeChange, isMuted, onToggleMute
}: ProviderProps) => {

  const value = useMemo(() => ({ 
    next: onNext, 
    prev: onPrev, 
    toggle: onToggle, 
    isPlaying,
    volume,
    setVolume: onVolumeChange,
    isMuted,
    toggleMute: onToggleMute,
  }), [onNext, onPrev, onToggle, isPlaying, volume, onVolumeChange, isMuted, onToggleMute]);

  return (
    <ControlsContext.Provider value={value}>
      {children}
    </ControlsContext.Provider>
  );
};