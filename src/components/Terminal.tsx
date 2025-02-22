"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface TerminalProps {
  onCommand: (command: string) => void
}

export default function Terminal({ onCommand }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  const validateCommand = (input: string): boolean => {
    const [cmd, ...args] = input.split(" ")
    if (cmd != "git" || args.length == 0) {
      return false
    }

    if ((args[0] == "clone" && args[1]) ||
      (args[0] == "checkout" && args[1]) ||
      (args[0] == "add" && args[1]) ||
      (["branch", "pull", "merge", "push", "log", "commit", "status"].includes(args[0]))) {
      return true
    }

    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const valid = validateCommand(input.trim())
      if (valid) {
        onCommand(input.trim())
        setHistory((prev) => [...prev, `$ ${input}`])
      } else {
        setHistory((prev) => [...prev, `$ ${input} is not a git command.`])
      }
      setInput("")
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [])

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
      <div ref={terminalRef} className="h-64 overflow-auto mb-4 custom-scrollbar">
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
  )
}

