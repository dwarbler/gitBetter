"use client";

import { useState } from "react";
import Terminal from "./Terminal";
import RepoVisualization from "./RepoVisualization";

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

export default function GitGame() {
  const [repoState, setRepoState] = useState<RepoState>({
    branches: [],
    currentBranch: "",
    commits: [],
    filetrees: [],
  });

  const [challenge, setChallenge] = useState({
    description: 'Create a new branch called "feature"',
    completed: false,
  });

  const recurseTree = (fn: (file: File) => void, files: File[]) => {
    for (const file of files) {
      fn(file);
      if (file.files) {
        recurseTree(fn, file.files);
      }
    }
  };

  const handleCommand = (command: string) => {
    // Parse and execute Git command
    const [cmd, ...args] = command.split(" ");

    switch (cmd) {
      case "git":
        if (args[0] == "init") {
          setRepoState({
            branches: ["main"],
            currentBranch: "main",
            commits: [],
            filetrees: [
              {
                branch: "main",
                files: [
                  {
                    filename: ".git",
                    filetype: "dir",
                    staged: false,
                  },
                ],
              },
            ],
          });
        } else if (repoState && args[0] === "branch") {
          const newBranch = args[1];
          if (!repoState.branches.includes(newBranch)) {
            setRepoState((prev) => ({
              ...prev,
              branches: [...prev.branches, newBranch],
            }));
            if (
              challenge.description ===
              `Create a new branch called "${newBranch}"`
            ) {
              setChallenge((prev) => ({ ...prev, completed: true }));
            }
          }
        } else if (args[0] == "log") {
          setRepoState((prev) => ({
            ...prev,
            commits: [
              ...prev.commits.filter(
                (commit) => commit.branch != prev.currentBranch
              ),
              ...prev.commits
                .filter((commit) => commit.branch == prev.currentBranch)
                .map((commit) => ({ ...commit, logged: true })),
            ],
          }));
        } else if (
          args[0] == "clone" &&
          args[1] == "git@github.com/gitBetterTester"
        ) {
          setRepoState({
            branches: ["main"],
            currentBranch: "main",
            commits: [],
            filetrees: [
              {
                branch: "main",
                files: [
                  {
                    filename: ".git",
                    filetype: "dir",
                    staged: false,
                  },
                  {
                    filename: "src",
                    filetype: "dir",
                    staged: false,
                    files: [
                      {
                        filename: "app.tsx",
                        filetype: "file",
                        staged: false,
                      },
                      {
                        filename: "globals.css",
                        filetype: "file",
                        staged: false,
                      },
                    ],
                  },
                ],
              },
            ],
          });
        } else if (args[0] == "add") {
          const path = args[1].split("/");
          // tree is modified inside of the recursive function
          // however, eslint complains if it's not this way
          // eslint-disable-next-line prefer-const
          let tree = repoState.filetrees.find(
            (filetree) => filetree.branch == repoState.currentBranch
          );
          if (path[0] == "." && path.length == 1) {
            if (tree?.files) {
              recurseTree((file: File) => {
                file.staged = true;
              }, tree?.files);
            }
          } else {
            let curr = tree?.files.find((file) => file.filename == path[0]);

            for (const file of path.slice(1)) {
              curr = curr?.files?.find((f) => f.filename == file);
            }

            if (curr) {
              curr.staged = true;
            }
          }

          if (tree) {
            setRepoState((prev) => ({
              ...prev,
              filetrees: [
                ...prev.filetrees.filter(
                  (filetree) => filetree.branch != repoState.currentBranch
                ),
                tree,
              ],
            }));
          }
        } else if (args[0] == "commit") {
          setRepoState((prev) => ({
            ...prev,
            commits: [
              ...prev.commits,
              {
                id: Math.random().toString(16).slice(2),
                message: args
                  .slice(2)
                  .join(" ")
                  .slice(1, args.slice(2).join(" ").length - 1),
                branch: repoState.currentBranch,
                pushed: false,
                logged: false,
              },
            ],
          }));
        } else if (args[0] == "checkout") {
          setRepoState((prev) => ({
            ...prev,
            currentBranch: args[1],
          }));
        }
        // Add more Git command implementations here
        break;
      default:
        console.log("Unknown command");
    }
  };

  return (
    <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-blue-300">
          Current Mission:
        </h2>
        <p
          className={`text-lg ${
            challenge.completed ? "text-green-400" : "text-yellow-300"
          }`}
        >
          {challenge.description}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <RepoVisualization repoState={repoState} />
        </div>
        <div className="flex-1">
          <Terminal onCommand={handleCommand} repoState={repoState} />
        </div>
      </div>
    </div>
  );
}
