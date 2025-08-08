import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // ✅ Import this

function Footer() {
  const [style, setStyle] = useState({});
  const location = useLocation(); // ✅ Get current route
  const pathname = location.pathname;

  useEffect(() => {
    const height = window.innerHeight;

    if (height < 700) {
      setStyle({ fontSize: '1.5rem', bottom: '0.25rem' }); // small
    } else if (height < 1920) {
      setStyle({ fontSize: '1.6rem', bottom: '0.8rem' }); // medium
    } else {
      setStyle({ fontSize: '2rem', bottom: '1.3rem', left: '1rem' }); // large
    }
  }, []);

  // ✅ Conditionally render nothing on /leaderboard route
  if (pathname === '/leaderboard') return null;

  return (
    <p
      className="absolute text-white left-4 z-50"
      style={style}
    >
      Made with Google Gemini
    </p>
  );
}

export default Footer;
