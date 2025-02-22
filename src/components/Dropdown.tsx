"use client";

import * as React from "react";
import { ChevronsUpDown, File, Folder } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";

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
  }[];
  filetrees: {
    branch: string;
    files: File[];
  }[];
}

interface RepoProps {
  repoState: RepoState
}

export default function GitDropdown({ repoState }: RepoProps) {
  let filetree = repoState.filetrees.find((filetree) => filetree.branch == repoState.currentBranch)

  const traverseFile = (file: File) => {
    if (file.filetype == "dir") {
      return (<Collapsible
        key={file.filename}
        defaultOpen={false}
        className="w-[350px] space-y-2 mb-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <div className="flex items-center justify-start space-x-4 p-0">
            <Folder />
            <span className={`text-md ${file.staged ? "" : "text-yellow-300"}`}>
              {file.filename}
            </span>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {file.files?.map((subfile) => traverseFile(subfile))}
        </CollapsibleContent>
      </Collapsible>)
    }

    return (
      <div className="flex text-md items-center justify-start space-x-4 px-4">
        <span>{'\t'}</span>
        {<File />}
        <span>{file.filename}</span>
      </div>
    )
  }

  return (
    <>
      {
        filetree?.files.map((file) => traverseFile(file))
      }
    </>
  );
}
