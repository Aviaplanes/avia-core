'use client'

import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  LucideIcon 
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  left: ChevronLeft,
  right: ChevronRight,
  play: Play,
  pause: Pause,
  volumeHigh: Volume2,
  mute: VolumeX,
}

interface Props {
  icon?: keyof typeof icons;
  onClick?: () => void;
}

export default function Button({ icon = 'left', onClick }: Props) {
  const Icon = icons[icon];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="
        group
        flex items-center justify-center
        w-12 h-12
        rounded-full
        bg-white/10 dark:bg-black/30
        backdrop-blur-xl
        border border-white/20 dark:border-white/10
        shadow-lg
        cursor-pointer
      "
    >
      <Icon 
        className="w-6 h-6 text-white group-hover:text-white/90 transition-colors" 
        strokeWidth={2.5} 
      />
    </motion.button>
  )
}