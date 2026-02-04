"use client";

import { Button } from "./Button";
import { PlayPause, Navigation, Repeat } from "../icons";

interface ControlButtonsProps {
  isPlaying: boolean;
  isRepeat: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRepeat: () => void;
}

export const ControlButtons = ({
  isPlaying,
  isRepeat,
  onPlayPause,
  onPrev,
  onNext,
  onRepeat,
}: ControlButtonsProps) => {
  return (
    <div className="flex items-center gap-3 text-black/80 dark:text-white/80">
      <Button ariaLabel="Previous" onClick={onPrev}>
        <Navigation.Previous />
      </Button>
      <Button
        ariaLabel={isPlaying ? "Pause" : "Play"}
        size="large"
        onClick={onPlayPause}
      >
        {isPlaying ? <PlayPause.Pause /> : <PlayPause.Play />}
      </Button>
      <Button ariaLabel="Next" onClick={onNext}>
        <Navigation.Next />
      </Button>
      <Button
        ariaLabel={isRepeat ? "Disable repeat" : "Repeat"}
        onClick={onRepeat}
        isActive={isRepeat}
      >
        <Repeat isActive={isRepeat} />
      </Button>
    </div>
  );
};
