"use client";

import * as React from "react";
import { ChevronsUpDown, File, Folder } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";

interface RootDir {
  subdirs: {
    directory_name: string,
    staged: boolean,
    files: {
      filename: string,
      staged: boolean,
    }[],
  }[],
}

interface FileTree {
  filetree: RootDir,
}

export default function GitDropdown({ filetree }: FileTree) {
  return (
    <>
      {
        filetree.subdirs.map((dir) => (
          <Collapsible
            key={dir.directory_name}
            defaultOpen={false}
            className="w-[350px] space-y-2 group"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <div className="flex items-center justify-start space-x-4 p-0">
                <Folder />
                <h4 className="text-sm font-semibold">
                  {dir.directory_name}
                </h4>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              {dir.files.map((file) => (
                <div className="flex items-center justify-start space-x-4 px-4">
                  <span>{'\t'}</span>
                  {<File />}
                  <span>{file.filename}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))
      }
    </>
  );
}
