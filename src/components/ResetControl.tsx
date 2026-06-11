export interface ResetControlProps {
  className?: string
  disabled?: boolean
  onReset: () => void
}

export function ResetControl({
  className,
  disabled = false,
  onReset,
}: ResetControlProps) {
  return (
    <div
      aria-label="Board reset"
      className={resetControlClassName(className)}
      role="group"
    >
      <span className="text-xs font-medium uppercase text-slate-500">
        Board
      </span>
      <button
        aria-label="Reset board to zero"
        className={resetButtonClassName(disabled)}
        disabled={disabled}
        onClick={onReset}
        type="button"
      >
        Reset
      </button>
    </div>
  )
}

function resetControlClassName(className?: string): string {
  return [
    'rounded-md border border-slate-200 bg-white px-4 py-3 text-right shadow-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

function resetButtonClassName(disabled: boolean): string {
  return [
    'mt-2 h-8 w-full rounded-md border px-3 text-sm font-semibold',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600',
    disabled
      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
      : 'border-slate-300 bg-white text-slate-950 hover:bg-slate-50',
  ].join(' ')
}
