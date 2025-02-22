"use client"

import { useState } from "react"
import Terminal from "./Terminal"
import RepoVisualization from "./RepoVisualization"

export default function GitGame() {
  const [repoState, setRepoState] = useState({
    branches: ["main"],
    currentBranch: "main",
    commits: [
      {
        id: "initial",
        message: "Initial commit",
        branch: "main",
      },
    ],
  })

  const [challenge, setChallenge] = useState({
    description: 'Create a new branch called "feature"',
    completed: false,
  })

  const handleCommand = (command: string) => {
    // Parse and execute Git command
    const [cmd, ...args] = command.split(" ")

    switch (cmd) {
      case "git":
        if (args[0] === "branch" && args[1]) {
          const newBranch = args[1]
          if (!repoState.branches.includes(newBranch)) {
            setRepoState((prev) => ({
              ...prev,
              branches: [...prev.branches, newBranch],
            }))
            if (challenge.description === `Create a new branch called "${newBranch}"`) {
              setChallenge((prev) => ({ ...prev, completed: true }))
            }
          }
        }
        // Add more Git command implementations here
        break
      default:
        console.log("Unknown command")
    }
  }

  return (
    <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-blue-300">Current Mission:</h2>
        <p className={`text-lg ${challenge.completed ? "text-green-400" : "text-yellow-300"}`}>
          {challenge.description}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <RepoVisualization repoState={repoState} />
        </div>
        <div className="flex-1">
          <Terminal onCommand={handleCommand} />
        </div>
      </div>
    </div>
  )
}

