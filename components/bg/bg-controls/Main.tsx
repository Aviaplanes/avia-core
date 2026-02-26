// src/components/bg/bg-controls/Main.tsx
'use client';

import Button from './Button';
import VolumeSlider from './VolumeSlider';
import { useControls } from './controls';

export function BGControls({ className = "fixed top-6 left-6" }: { className?: string }) {
  const controls = useControls();
  
  if (!controls) return null;

  const { prev, next, toggle, isPlaying } = controls;

  return (
    <div className={`${className} z-50 flex gap-3 items-center`}>
      <Button icon="left" onClick={prev} />
      <Button icon={isPlaying ? 'pause' : 'play'} onClick={toggle} />
      <Button icon="right" onClick={next} />
      
      
      <VolumeSlider />
    </div>
  );
}