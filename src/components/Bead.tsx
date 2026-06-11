import type { CSSProperties } from 'react'
import type { BeadState, EarthBeadState } from '../types/soroban'

const BEAD_HEIGHT_PX = 36
const BEAD_GAP_PX = 8
const BEAD_TRAVEL_PX = 44

export interface BeadProps {
  bead: BeadState
  className?: string
  onPress?: (bead: BeadState) => void
}

export function Bead({ bead, className, onPress }: BeadProps) {
  const style = {
    '--bead-y': `${getBeadTranslateY(bead)}px`,
  } as CSSProperties
  const classes = beadClassName(bead, Boolean(onPress), className)
  const label = beadLabel(bead)

  if (onPress) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={bead.active}
        className={classes}
        data-active={bead.active}
        data-bead-kind={bead.kind}
        onClick={() => onPress(bead)}
        style={style}
      >
        <BeadFace />
      </button>
    )
  }

  return (
    <div
      aria-label={label}
      className={classes}
      data-active={bead.active}
      data-bead-kind={bead.kind}
      role="img"
      style={style}
    >
      <BeadFace />
    </div>
  )
}

function getBeadTranslateY(bead: BeadState): number {
  if (bead.kind === 'heavenly') {
    const activeOffset = -BEAD_HEIGHT_PX - BEAD_GAP_PX

    return bead.position === 'toward-bar'
      ? activeOffset
      : activeOffset - BEAD_TRAVEL_PX
  }

  const stackOffset = BEAD_GAP_PX + bead.index * (BEAD_HEIGHT_PX + BEAD_GAP_PX)

  return bead.position === 'toward-bar'
    ? stackOffset
    : stackOffset + BEAD_TRAVEL_PX
}

function BeadFace() {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-1 h-2 rounded-full bg-white/45"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-3 bottom-1 h-1 rounded-full bg-black/20"
      />
    </>
  )
}

function beadClassName(
  bead: BeadState,
  interactive: boolean,
  className?: string,
): string {
  const stateClasses = bead.active
    ? 'border-amber-800 bg-gradient-to-b from-amber-300 via-orange-500 to-amber-800 shadow-md shadow-amber-950/20'
    : 'border-stone-500 bg-gradient-to-b from-stone-100 via-stone-300 to-stone-500 opacity-90 shadow-sm shadow-slate-950/10'

  return [
    'absolute left-1/2 top-0 h-9 w-16 -translate-x-1/2 translate-y-[var(--bead-y)] overflow-hidden rounded-full border p-0',
    'transition-[box-shadow,opacity,transform] duration-150 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600',
    interactive ? 'cursor-pointer' : '',
    stateClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

function beadLabel(bead: BeadState): string {
  const state = bead.active ? 'active' : 'inactive'

  if (bead.kind === 'earth') {
    return `Earth bead ${earthBeadNumber(bead)} is ${state}`
  }

  return `Heavenly bead is ${state}`
}

function earthBeadNumber(bead: EarthBeadState): number {
  return bead.index + 1
}
