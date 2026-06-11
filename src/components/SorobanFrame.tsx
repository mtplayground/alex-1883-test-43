import type { BoardState, RodState } from '../types/soroban'
import { Rod } from './Rod'

export interface SorobanFrameProps {
  board: BoardState
  className?: string
  disabled?: boolean
  onChange?: (board: BoardState) => void
}

export function SorobanFrame({
  board,
  className,
  disabled = false,
  onChange,
}: SorobanFrameProps) {
  const interactive = Boolean(onChange) && !disabled

  function handleRodChange(nextRod: RodState) {
    if (!onChange || disabled) {
      return
    }

    onChange({
      rods: board.rods.map((rod) =>
        rod.index === nextRod.index ? nextRod : rod,
      ),
    })
  }

  return (
    <section
      aria-disabled={disabled || undefined}
      aria-label="Soroban frame"
      className={frameClassName(className)}
      role="group"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-lg border-[8px] border-amber-950 bg-[linear-gradient(135deg,#8a4f27_0%,#6f3f1f_42%,#3f2314_100%)] shadow-inner sm:border-[10px]"
      />
      <div
        aria-hidden="true"
        className="absolute left-4 right-4 top-[8.5rem] z-20 h-4 -translate-y-1/2 rounded-full bg-gradient-to-b from-slate-700 via-slate-950 to-black shadow-md shadow-slate-950/40 sm:left-6 sm:right-6"
      />
      <div className="relative z-10 overflow-x-auto overscroll-x-contain">
        <div className="flex min-w-max justify-center gap-1.5 px-3 py-5 sm:gap-2 sm:px-6 sm:py-6">
          {board.rods.map((rod) => (
            <Rod
              className="border-amber-950/20 bg-amber-50/80 shadow-sm shadow-amber-950/15"
              disabled={disabled}
              key={rod.id}
              onChange={interactive ? handleRodChange : undefined}
              rod={rod}
              showReckoningBar={false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function frameClassName(className?: string): string {
  return [
    'relative overflow-hidden rounded-lg border border-amber-950/20 bg-amber-950 p-0 shadow-xl shadow-slate-950/15',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
