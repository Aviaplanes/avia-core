"use client";

interface ButtonProps {
  ariaLabel: string;
  children: React.ReactNode;
  size?: 'normal' | 'large';
  onClick?: () => void;
  isActive?: boolean;
}

export const Button = ({ ariaLabel, children, size = 'normal', onClick, isActive = false }: ButtonProps) => {
  const paddingClass = size === 'large' ? 'p-2' : 'p-1';
  const activeClass = isActive 
    ? 'text-white bg-white/20' 
    : 'text-black/80 dark:text-white/80';
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full ${paddingClass} transition-all duration-150 ease-out hover:scale-110 active:scale-90 focus:outline-none cursor-pointer ${activeClass}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};