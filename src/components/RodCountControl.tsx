const MIN_ROD_COUNT = 1
const MAX_ROD_COUNT = 9

export interface RodCountControlProps {
  rodCount: number
  className?: string
  max?: number
  min?: number
  onChange: (rodCount: number) => void
}

export function RodCountControl({
  rodCount,
  className,
  max = MAX_ROD_COUNT,
  min = MIN_ROD_COUNT,
  onChange,
}: RodCountControlProps) {
  const canDecrease = rodCount > min
  const canIncrease = rodCount < max

  function handleStep(delta: number) {
    const nextRodCount = clampRodCount(rodCount + delta, min, max)

    if (nextRodCount !== rodCount) {
      onChange(nextRodCount)
    }
  }

  return (
    <div
      aria-label="Rod count"
      className={rodCountControlClassName(className)}
      role="group"
    >
      <span className="text-xs font-medium uppercase text-slate-500">Rods</span>
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          aria-label="Decrease rod count"
          className={stepButtonClassName(canDecrease)}
          disabled={!canDecrease}
          onClick={() => handleStep(-1)}
          type="button"
        >
          -
        </button>
        <output
          aria-label="Current rod count"
          className="min-w-8 text-center text-2xl font-semibold tabular-nums text-slate-950"
        >
          {rodCount}
        </output>
        <button
          aria-label="Increase rod count"
          className={stepButtonClassName(canIncrease)}
          disabled={!canIncrease}
          onClick={() => handleStep(1)}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  )
}

function clampRodCount(rodCount: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, rodCount))
}

function rodCountControlClassName(className?: string): string {
  return [
    'rounded-md border border-slate-200/90 bg-white/95 px-4 py-3 text-right shadow-sm shadow-slate-950/5',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

function stepButtonClassName(enabled: boolean): string {
  return [
    'grid h-8 w-8 place-items-center rounded-md border text-lg font-semibold leading-none shadow-sm',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600',
    enabled
      ? 'border-slate-300 bg-white text-slate-950 hover:bg-emerald-50'
      : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400',
  ].join(' ')
}
