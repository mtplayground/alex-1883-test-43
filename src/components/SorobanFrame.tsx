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
        className="absolute inset-0 rounded-lg border-[10px] border-amber-950 bg-amber-900 shadow-inner"
      />
      <div
        aria-hidden="true"
        className="absolute left-6 right-6 top-[8.5rem] z-20 h-4 -translate-y-1/2 rounded-full bg-slate-950 shadow-md"
      />
      <div className="relative z-10 overflow-x-auto">
        <div className="flex min-w-max justify-center gap-2 px-6 py-6">
          {board.rods.map((rod) => (
            <Rod
              className="border-amber-950/20 bg-amber-50/70"
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
    'relative overflow-hidden rounded-lg bg-amber-950 p-0 shadow-xl shadow-slate-950/10',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
