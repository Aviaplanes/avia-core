interface RepeatIconProps {
  isActive: boolean;
}

export const Repeat = ({ isActive }: RepeatIconProps) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 512 512" 
    className={isActive ? "" : "opacity-70 text-white" } 
    height="18" 
    width="18" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="32" 
      d="m320 120 48 48-48 48"
    />
    <path 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="32" 
      d="M352 168H144a80.24 80.24 0 0 0-80 80v16m128 128-48-48 48-48"
    />
    <path 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="32" 
      d="M160 344h208a80.24 80.24 0 0 0 80-80v-16"
    />
    {isActive && (
      <circle 
        cx="256" 
        cy="256" 
        r="16" 
        fill="currentColor"
      />
    )}
  </svg>
);