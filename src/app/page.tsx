// app/page.tsx
"use client";
import GitGame from "@/components/GitGame";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <GitGame />
      </div>
    </main>
  );
}
