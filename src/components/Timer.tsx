// components/Timer.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface GameTimerProps {
  initialTime: number;
  onTimeUp?: () => void;
  isRunning?: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({
  initialTime,
  onTimeUp,
  isRunning = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(!isRunning);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-gray-800 rounded-lg px-4 py-2">
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-400">Time Remaining</div>
        <div className="font-mono text-2xl font-bold text-blue-400">
          {String(minutes).padStart(2, "0")}
          <span className="animate-pulse">:</span>
          {String(seconds).padStart(2, "0")}
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimeLeft(initialTime)}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameTimer;
