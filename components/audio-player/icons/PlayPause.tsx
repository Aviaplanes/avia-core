export const PlayPause = {
  Play: () => (
    <svg 
      className="text-white"
      stroke="currentColor" 
      fill="currentColor" 
      strokeWidth="0" 
      viewBox="0 0 512 512" 
      height="29" 
      width="29" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M133,440a35.37,35.37,0,0,1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37,7.46-27.53,19.46-34.33a35.13,35.13,0,0,1,35.77.45L399.12,225.48a36,36,0,0,1,0,61L151.23,434.88A35.5,35.5,0,0,1,133,440Z" />
    </svg>
  ),

  Pause: () => (
    <svg 
      className="text-white"
      stroke="currentColor" 
      fill="currentColor" 
      strokeWidth="0" 
      viewBox="0 0 512 512" 
      height="29" 
      width="29" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M208 432h-48a16 16 0 0 1-16-16V96a16 16 0 0 1 16-16h48a16 16 0 0 1 16 16v320a16 16 0 0 1-16 16zm144 0h-48a16 16 0 0 1-16-16V96a16 16 0 0 1 16-16h48a16 16 0 0 1 16 16v320a16 16 0 0 1-16 16z" />
    </svg>
  )
};