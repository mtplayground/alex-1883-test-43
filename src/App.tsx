import { useMemo, useState } from 'react'
import { ResetControl } from './components/ResetControl'
import { RodCountControl } from './components/RodCountControl'
import { SorobanFrame } from './components/SorobanFrame'
import { ValueReadout } from './components/ValueReadout'
import { clearBoard, createBoard, resizeBoard } from './model/soroban'
import { computeBoardValue } from './model/value'

function App() {
  const [board, setBoard] = useState(() => createBoard())
  const boardValue = useMemo(() => computeBoardValue(board), [board])
  const rodCount = board.rods.length

  function handleRodCountChange(nextRodCount: number) {
    setBoard((currentBoard) => resizeBoard(currentBoard, nextRodCount))
  }

  function handleReset() {
    setBoard((currentBoard) => clearBoard(currentBoard))
  }

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#f8fafc_0%,#f5f5f4_52%,#eef6f2_100%)] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-950/5 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-lg font-semibold">Soroban</h1>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 shadow-sm" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-8 lg:py-12">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_48rem] lg:items-end">
          <div className="space-y-3">
            <p className="text-sm font-medium text-emerald-700">Workspace</p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Interactive soroban
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:self-stretch">
            <RodCountControl
              onChange={handleRodCountChange}
              rodCount={rodCount}
            />
            <ResetControl disabled={boardValue === 0} onReset={handleReset} />
            <ValueReadout value={boardValue} />
          </div>
        </section>

        <SorobanFrame board={board} onChange={setBoard} />
      </main>
    </div>
  )
}

export default App
