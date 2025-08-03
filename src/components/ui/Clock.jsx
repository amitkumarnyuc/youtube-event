export const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-clock"
  >
    <circle cx="12" cy="12" r="10" />
    
    {/* Hour hand (static) */}
    <line x1="12" y1="12" x2="12" y2="8" />
    
    {/* Second hand (rotating) */}
    <line
      x1="12"
      y1="12"
      x2="16"
      y2="15"
      style={{
        transformOrigin: 'center',
        animation: 'spinClock 15s linear infinite'
      }}
    />

    {/* Keyframes directly in SVG using <style> */}
    <style>
      {`
        @keyframes spinClock {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </svg>
);
