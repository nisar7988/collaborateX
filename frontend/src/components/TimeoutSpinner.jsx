import React, { useEffect, useState } from 'react';

const TimeoutSpinner = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const progress = (timeLeft / 60) * 100;

  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-5 my-3">
      {/* Background Border (Full Circle) */}
      <div className="absolute w-full h-full rounded-full border-4 border-blue-500"></div>

      {/* Shrinking Border */}
      <div
        className="absolute w-full h-full rounded-full border-4 border-white"
        style={{
          clipPath: `inset(0px 0px 0px ${100 - progress}%)`,
          transition: 'clip-path 1s linear',
        }}
      />

      {/* Countdown Timer */}
      <div className="flex items-center justify-center">
        <span className="text-lg font-semibold">{timeLeft}</span>
      </div>
    </div>
  );
};

export default TimeoutSpinner;
