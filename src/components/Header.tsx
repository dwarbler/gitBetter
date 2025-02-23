// components/Timer.tsx
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import levels from "@/app/states/levels.json";

interface File {
  filename: string;
  filetype: string;
  staged: boolean;
  files?: File[];
}

interface RepoState {
  branches: string[];
  currentBranch: string;
  commits: {
    id: string;
    message: string;
    branch: string;
    pushed: boolean;
    logged: boolean;
  }[];
  filetrees: {
    branch: string;
    files: File[];
  }[];
}

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
  setRepo: Dispatch<SetStateAction<RepoState>>;
  setCommands: Dispatch<SetStateAction<string[]>>;
}

export default function Header({
  initialTime,
  onTimeUp,
  isRunning = true,
  level,
  setLevel,
  setRepo,
  setCommands,
}: HeaderProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(!isRunning);
  const [levelName, setLevelName] = useState("level_1");

  const changeLevel = (level_name: string) => {
    setLevel(levels[level_name as keyof typeof levels]);
    setLevelName(level_name);
    setTimeLeft(initialTime);
    setRepo({
      branches: [],
      currentBranch: "",
      commits: [],
      filetrees: [],
    });
    setCommands([]);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return !level.completed ? prevTime - 1 : prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeUp, level.completed]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon">
              <MenuIcon className="h-12 w-12" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuLabel>Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={levelName}
              onValueChange={changeLevel}
            >
              <DropdownMenuRadioItem value="level_1">1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="level_2">2</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="level_3">3</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="level_4">4</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="level_5">5</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="level_6">6</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="level_7">7</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="level_8">8</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
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
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
              style={{
                width: `${Math.floor((timeLeft / initialTime) * 100)}%`,
              }}
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
