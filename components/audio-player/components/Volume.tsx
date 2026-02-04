"use client";

import { Button } from "./Button";
import { Volume as VolumeIcon, Utility } from "../icons";

interface VolumeProps {
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
}

export const Volume = ({
  isMuted,
  volume,
  onToggleMute,
}: VolumeProps) => {
  return (
    <div className="flex items-center gap-4 text-black/80 dark:text-white/80">
      <Button ariaLabel="More Options">
        <Utility.MoreOptions />
      </Button>
      <Button ariaLabel="List">
        <Utility.List />
      </Button>
      <Button ariaLabel={isMuted ? "Unmute" : "Mute"} onClick={onToggleMute}>
        <VolumeIcon isMuted={isMuted} volume={volume} />
      </Button>
    </div>
  );
};