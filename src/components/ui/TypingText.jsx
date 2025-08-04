import { useEffect, useState } from "react";

export const TypingText = ({ text, speed = 50, pause = 1500 }) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (index < text.length) {
      timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
    } else {
      // Pause before restarting
      timeout = setTimeout(() => {
        setDisplayed("");
        setIndex(0);
      }, pause);
    }

    return () => clearTimeout(timeout);
  }, [index, text, speed, pause]);

  return (
    <h1 className="text-5xl font-bold text-black text-center leading-relaxed whitespace-pre-line">
      {displayed}
      <span className="animate-pulse">|</span>
    </h1>
  );
};
