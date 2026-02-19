"use client";

import Image from "next/image";
import { Song } from "../types";

interface ProgressBarProps {
  song: Song;
  progressRef: React.RefObject<HTMLDivElement | null>;
  currentTime: number;
  duration: number;
  dragTime: number | null;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ProgressBar = ({
  song,
  progressRef,
  currentTime,
  duration,
  dragTime,
  isDragging,
  onMouseDown,
  onClick,
}: ProgressBarProps) => {
  // Если duration ещё не загрузилась — показываем 0%, иначе будет NaN → 100%
  const progress = duration > 0 
    ? ((isDragging && dragTime !== null ? dragTime : currentTime) / duration) * 100
    : 0;

  return (
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="h-14 w-14 rounded overflow-hidden bg-black/10 dark:bg-white/10 shrink-0">
        {song.cover ? (
          <Image
            alt={song.title}
            className="w-full h-full object-cover"
            draggable="false"
            loading="lazy"
            width={300}
            height={300}
            src={song.cover}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {song.title.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div style={{ 
          fontFamily: 'ui-title-bold, sans-serif', 
          fontWeight: 600, 
          fontSize: '14px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {song.title}
        </div>

        <div style={{ fontFamily: 'ui-title-bold, sans-serif', fontSize: '11px' }}>
          {song.artist || "Неизвестный исполнитель"}
        </div>

        <div
          ref={progressRef}
          className="mt-1 h-[3px] w-full max-w-full bg-black/10 dark:bg-white/10 rounded cursor-pointer"
          onMouseDown={onMouseDown}
          onClick={onClick}
        >
          <div
            className="h-full bg-white/40 rounded transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};