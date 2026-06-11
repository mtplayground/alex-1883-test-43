const decimalFormatter = new Intl.NumberFormat('en-US')

export interface ValueReadoutProps {
  value: number
  className?: string
}

export function ValueReadout({ value, className }: ValueReadoutProps) {
  return (
    <output
      aria-label="Decimal value"
      aria-live="polite"
      className={valueReadoutClassName(className)}
      data-value={value}
    >
      <span className="text-xs font-medium uppercase text-slate-500">
        Value
      </span>
      <span className="mt-1 block text-3xl font-semibold tabular-nums text-slate-950">
        {decimalFormatter.format(value)}
      </span>
    </output>
  )
}

function valueReadoutClassName(className?: string): string {
  return [
    'rounded-md border border-slate-200/90 bg-white/95 px-4 py-3 text-right shadow-sm shadow-slate-950/5',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
