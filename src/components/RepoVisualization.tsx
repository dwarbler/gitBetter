import GitDropdown from "./Dropdown";

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

interface RepoVisualizationProps {
  repoState: RepoState;
}

export default function RepoVisualization({
  repoState,
}: RepoVisualizationProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-blue-300">
        {repoState.currentBranch}
      </h3>

      <div className="mb-6">
        <GitDropdown repoState={repoState} />
      </div>

      <div>
        <h4 className="font-semibold text-gray-300 mb-2">Commit Log:</h4>
        <ul className="space-y-2">
          {repoState.commits
            .filter(
              (commit) =>
                commit.logged == true &&
                commit.branch == repoState.currentBranch
            )
            .reverse()
            .map((commit) => (
              <li key={commit.id} className="animate-fadeIn text-sm">
                <span className="text-yellow-400">{commit.id.slice(0, 7)}</span>{" "}
                - <span className="text-green-400">{commit.message}</span>{" "}
                <span className="text-blue-300">({commit.branch})</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
