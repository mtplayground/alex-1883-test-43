import { useMemo, useState } from 'react'
import { RodCountControl } from './components/RodCountControl'
import { SorobanFrame } from './components/SorobanFrame'
import { ValueReadout } from './components/ValueReadout'
import { createBoard, resizeBoard } from './model/soroban'
import { computeBoardValue } from './model/value'

function App() {
  const [board, setBoard] = useState(() => createBoard())
  const boardValue = useMemo(() => computeBoardValue(board), [board])
  const rodCount = board.rods.length

  function handleRodCountChange(nextRodCount: number) {
    setBoard((currentBoard) => resizeBoard(currentBoard, nextRodCount))
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white/85">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-lg font-semibold">Soroban</h1>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:py-12">
        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_32rem] md:items-end">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600">Workspace</p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Interactive soroban
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <RodCountControl
              onChange={handleRodCountChange}
              rodCount={rodCount}
            />
            <ValueReadout value={boardValue} />
          </div>
        </section>

        <SorobanFrame board={board} onChange={setBoard} />
      </main>
    </div>
  )
}

export default App
