// src/components/bg/bg-controls/VolumeSlider.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume, Volume1, Volume2, VolumeX, LucideIcon } from 'lucide-react';
import { useControls } from './controls';

const getVolumeIcon = (volume: number, isMuted: boolean): LucideIcon => {
  if (isMuted || volume === 0) return VolumeX;
  if (volume < 0.33) return Volume;
  if (volume < 0.66) return Volume1;
  return Volume2;
};

const glassStyle = `
  bg-white/10 dark:bg-black/30
  backdrop-blur-xl
  border border-white/20 dark:border-white/10
  shadow-lg
`;

const springTransition = { 
  type: "spring", 
  stiffness: 400, 
  damping: 17 
} as const;

export default function VolumeSlider() {
  const controls = useControls();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!controls) return null;

  const { volume, setVolume, isMuted, toggleMute } = controls;
  const Icon = getVolumeIcon(volume, isMuted);
  const displayVolume = isMuted ? 0 : volume;
  const isOpen = isHovered || isDragging;

  const updateVolumeFromEvent = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const v = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    setVolume(v);
  }, [setVolume]);

  // Глобальные обработчики — работают даже за пределами
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateVolumeFromEvent(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateVolumeFromEvent]);

  return (
    <div 
      className="relative flex items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        onClick={toggleMute}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        transition={springTransition}
        className={`
          group flex items-center justify-center
          w-12 h-12 rounded-full
          ${glassStyle}
          cursor-pointer z-10
        `}
      >
        <Icon className="w-5 h-5 text-white group-hover:text-white/90 transition-colors" strokeWidth={2.5} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, scale: 0.8 }}
            animate={{ width: 140, opacity: 1, scale: 1 }}
            exit={{ width: 0, opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
            className={`
              overflow-hidden
              flex items-center
              h-12 rounded-full
              ${glassStyle}
              cursor-pointer
            `}
          >
            <div 

                ref={trackRef}
                className="relative w-full h-full overflow-hidden rounded-full"
                onMouseDown={(e) => {
                    setIsDragging(true); 
                    updateVolumeFromEvent(e.clientX); 
                }}
            >
                <div 
                    className="absolute inset-y-0 left-0 bg-white/80"
                    style={{ width: `${displayVolume * 100}%` }}
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}