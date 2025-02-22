import GitGame from "@/components/GitGame"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Git Practice: Command Master</h1>
      <GitGame />
    </main>
  )
}

