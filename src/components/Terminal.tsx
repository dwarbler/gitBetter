"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";

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

interface TerminalProps {
  onCommand: (command: string) => void;
  repoState: RepoState;
}

const stagedFiles = (files: File[]): boolean => {
  for (const file of files) {
    if (file.staged) {
      return true;
    }
    if (file.files) {
      const res = stagedFiles(file.files);
      if (res) {
        return true;
      }
    }
  }
  return false;
};

export default function Terminal({ onCommand, repoState }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const validateCommand = (input: string): string => {
    const [cmd, ...args] = input.split(" ");
    if (cmd != "git" || args.length == 0) {
      return `>> ${input} is not a valid git command. <<`;
    }

    if (args[0] == "init" && repoState.branches.length != 0) {
      return ">> Invalid command. Git repository already exists. <<";
    }

    if (args[0] == "checkout" && !repoState.branches.includes(args[1])) {
      return `>> Invalid command. Branch ${args[1]} does not exist. <<`;
    }

    if (
      args[0] == "push" &&
      !repoState.commits.find((commit) => commit.pushed == false)
    ) {
      return ">> No commits to push... <<";
    }

    if (args[0] == "add") {
      if (args[1] == ".") {
        return `$ ${input}`;
      }

      let path = args[1].split("/");

      if (path[0] == ".") {
        path = path.slice(1);
      }

      let curr = repoState.filetrees
        .find((filetree) => filetree.branch == repoState.currentBranch)
        ?.files.find((file) => file.filename == path[0]);

      if (!curr) {
        return ">> Invalid file path. <<";
      }

      for (const file of path.slice(1)) {
        if (!curr) {
          return ">> Invalid file path. <<";
        }
        curr = curr?.files?.find((f) => f.filename == file);
      }

      return curr ? `$ ${input}` : ">> Invalid file path. <<";
    }

    if (args[0] == "commit" && (!args[1] || args[1] != "-m" || !args[2])) {
      return '>> Invalid commit. Must git commit -m "commit message" <<';
    }

    if (args[0] == "commit") {
      const tree = repoState.filetrees.find(
        (filetree) => filetree.branch == repoState.currentBranch
      );

      if (!tree || !stagedFiles(tree?.files)) {
        return `>> No staged files on branch ${repoState.currentBranch}`;
      }
    }

    if (
      (args[0] == "clone" && args[1]) ||
      (args[0] == "checkout" && args[1]) ||
      (args[0] == "add" && args[1]) ||
      ["branch", "push", "log", "commit", "init"].includes(args[0])
    ) {
      return `$ ${input}`;
    }

    return `${input} is not a valid git command.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      if (input.trim() == "clear") {
        setHistory([]);
        setInput("");
      } else {
        const message = validateCommand(input.trim());
        if (message == `$ ${input.trim()}`) {
          onCommand(input.trim());
        }
        setHistory((prev) => [...prev, message]);
        setInput("");
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-gray-300 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-500">Git Terminal</div>
      </div>
      <div
        ref={terminalRef}
        className="h-64 overflow-auto mb-4 custom-scrollbar"
      >
        {history.map((line, index) => (
          <div key={index} className="animate-fadeIn">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <span className="mr-2 text-green-400">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent flex-grow outline-none text-gray-300"
            placeholder="Enter Git command..."
          />
        </div>
      </form>
    </div>
  );
}
