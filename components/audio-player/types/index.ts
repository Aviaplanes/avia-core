export interface Song {
  id: string;
  title: string;
  artist?: string;
  src: string;
  cover?: string;
  duration?: number;
}

export interface GlassAudioPlayerProps {
  songs: Song[];
  initialSongIndex?: number;
}

export interface ButtonProps {
  ariaLabel: string;
  children: React.ReactNode;
  size?: 'normal' | 'large';
  onClick?: () => void;
  isActive?: boolean;
}