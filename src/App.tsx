import { useState } from 'react'
import { SorobanFrame } from './components/SorobanFrame'
import { createBoard } from './model/soroban'

function App() {
  const [board, setBoard] = useState(() => createBoard())

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white/85">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-lg font-semibold">Soroban</h1>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:py-12">
        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600">Workspace</p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Interactive soroban
            </h2>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="font-medium text-slate-950">Ready</span>
          </div>
        </section>

        <SorobanFrame board={board} onChange={setBoard} />
      </main>
    </div>
  )
}

export default App
