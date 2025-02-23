// components/Timer.tsx
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";

interface LevelProps {
  level_num: number;
  challenge: string;
  error_count: number;
  level_xp: number;
  completed: boolean;
}

interface HeaderProps {
  initialTime: number;
  onTimeUp?: () => void;
  isRunning?: boolean;
  level: LevelProps;
  setLevel: Dispatch<SetStateAction<LevelProps>>;
}

export default function Header({
  initialTime,
  onTimeUp,
  isRunning = true,
  level,
  setLevel,
}: HeaderProps) {
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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Leaderboard</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className="text-4xl font-bold text-blue-400">GitBetter</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* XP Counter Component */}
        <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
              XP
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
              {level.level_num}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Current Level</div>
            <div className="text-xl font-bold text-yellow-400">
              {level.level_xp}
            </div>
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`w-3/4 h-full bg-gradient-to-r from-yellow-400 to-yellow-600`}
            ></div>
          </div>
        </div>
        {/* Timer Component */}
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
      </div>
    </div>
  );
}
