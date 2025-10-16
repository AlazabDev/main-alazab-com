import { useState, useEffect } from 'react';

interface RotatingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export const RotatingText = ({ texts, className = '', interval = 3000 }: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${className}`}
    >
      {texts[currentIndex]}
    </span>
  );
};
