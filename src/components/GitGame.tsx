"use client";

import { useState } from "react";
import Terminal from "./Terminal";
import RepoVisualization from "./RepoVisualization";

import initState from "@/app/states/init.json";

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

const recurseTree = (fn: (file: File) => void, files: File[]) => {
  for (const file of files) {
    fn(file);
    if (file.files) {
      recurseTree(fn, file.files);
    }
  }
};

const getCommitMessage = (args: string[]): string => {
  return args
    .slice(2)
    .join(" ")
    .slice(1, args.slice(2).join(" ").length - 1);
};

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

  const handleCommand = (command: string) => {
    // Parse and execute Git command
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_cmd, ...args] = command.split(" ");

    switch (args[0]) {
      case "init":
        setRepoState(initState);

      case "branch":
        const newBranch = args[1];
        const fileTree = repoState.filetrees.find(
          (filetree) => filetree.branch == repoState.currentBranch
        );

        if (!repoState.branches.includes(newBranch) && fileTree) {
          setRepoState((prev) => ({
            ...prev,
            branches: [...prev.branches, newBranch],
            filetrees: [
              ...prev.filetrees,
              {
                branch: newBranch,
                files: [...fileTree.files],
              },
            ],
          }));
        }

      case "checkout":
        setRepoState((prev) => ({
          ...prev,
          currentBranch: args[1],
        }));

      case "log":
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

      case "clone":
        import(
          `@/app/states/${args[1].split("/")[args[1].split("/").length - 1]}`
        ).then((res) => setRepoState(res.default));

      case "add":
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

      case "commit":
        setRepoState((prev) => ({
          ...prev,
          commits: [
            ...prev.commits,
            {
              id: Math.random().toString(16).slice(2),
              message: getCommitMessage(args),
              branch: repoState.currentBranch,
              pushed: false,
              logged: false,
            },
          ],
        }));
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
