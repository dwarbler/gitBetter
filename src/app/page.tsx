// app/page.tsx
"use client";
import GitGame from "@/components/GitGame";
import GameTimer from "@/components/Timer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
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
            <XPCounter />
            <GameTimer
              initialTime={300}
              onTimeUp={() => {
                console.log("Time is up!");
              }}
            />
          </div>
        </div>

        {/* Main Game Content */}
        <GitGame />
      </div>
    </main>
  );
}

// New XP Counter Component
const XPCounter = () => {
  return (
    <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
          XP
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
          5
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">Current Level</div>
        <div className="text-xl font-bold text-yellow-400">2,450 XP</div>
      </div>
      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="w-3/4 h-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
      </div>
    </div>
  );
};
