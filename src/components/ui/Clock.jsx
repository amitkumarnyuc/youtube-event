export const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="65"            // Increased from 48
    height="65"           // Increased from 48
    viewBox="0 0 24 24"
    fill="white"
    stroke="red"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-clock"
  >
    <circle cx="12" cy="12" r="10" />

    {/* Hour hand */}
    <line x1="12" y1="12" x2="12" y2="8" />

    {/* Second hand with animation */}
    <line
      x1="12"
      y1="12"
      x2="16"
      y2="15"
      style={{
        transformOrigin: 'center',
        animation: 'spinClock 15s linear infinite',
      }}
    />

    {/* Keyframes */}
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
