import React, { useEffect, useState } from 'react';

function Footer() {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const height = window.innerHeight;

    if (height < 700) {
      setStyle({ fontSize: '1.5rem', bottom: '0.25rem' }); // small
    } else if (height < 1920) {
      setStyle({ fontSize: '1.6rem', bottom: '0.8rem' }); // medium
    } else {
      setStyle({ fontSize: '2rem', bottom: '1.3rem' , left:'1rem'}); // large
    }
  }, []);

  return (
    <p
      className="absolute text-white left-4 z-50 "
      style={style}
    >
      Made with Google Gemini
    </p>
  );
}

export default Footer
