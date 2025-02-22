import { useState } from "react";
import GitDropdown from "./Dropdown";

interface File {
  filename: string;
  filetype: string;
  staged: boolean;
  subfiles?: File[];
}

interface RepoState {
  branches: string[];
  currentBranch: string;
  commits: {
    id: string;
    message: string;
    branch: string;
  }[];
  filetrees: {
    branch: string;
    filetree: File[];
  }[];
}

interface RepoVisualizationProps {
  repoState: RepoState;
}

let test = { subdirs: [{ directory_name: "test", staged: false, files: [{ filename: "testfile", staged: false }] }, { directory_name: "orang", staged: false, files: [{ filename: "testfile", staged: false }] }] }

export default function RepoVisualization({
  repoState,
}: RepoVisualizationProps) {
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-blue-300">
        Repository Visualization
      </h3>

      <div className="mb-6">
        <GitDropdown filetree={test} repoState={repoState} />
      </div>

      <div>
        <h4 className="font-semibold text-gray-300 mb-2">Commit Log:</h4>
        <ul className="space-y-2">
          {repoState.commits.map((commit) => (
            <li key={commit.id} className="animate-fadeIn text-sm">
              <span className="text-yellow-400">{commit.id.slice(0, 7)}</span> -{" "}
              <span className="text-green-400">{commit.message}</span>{" "}
              <span className="text-blue-300">({commit.branch})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
