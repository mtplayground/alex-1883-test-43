import { useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import type { BeadState, EarthBeadState } from '../types/soroban'

const BEAD_HEIGHT_PX = 36
const BEAD_GAP_PX = 8
const BEAD_TRAVEL_PX = 44
const DRAG_ACTIVATION_PX = 14

interface DragState {
  startY: number
}

export interface BeadProps {
  bead: BeadState
  className?: string
  onDrag?: (bead: BeadState, active: boolean) => void
  onPress?: (bead: BeadState) => void
}

export function Bead({ bead, className, onDrag, onPress }: BeadProps) {
  const dragState = useRef<DragState | null>(null)
  const suppressClick = useRef(false)
  const style = {
    '--bead-y': `${getBeadTranslateY(bead)}px`,
  } as CSSProperties
  const interactive = Boolean(onDrag || onPress)
  const classes = beadClassName(bead, interactive, className)
  const label = beadLabel(bead)

  function handleClick() {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }

    onPress?.(bead)
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!onDrag) {
      return
    }

    suppressClick.current = false
    dragState.current = {
      startY: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!onDrag || !dragState.current) {
      return
    }

    const deltaY = event.clientY - dragState.current.startY

    if (Math.abs(deltaY) < DRAG_ACTIVATION_PX) {
      return
    }

    suppressClick.current = true
    event.preventDefault()

    const nextActive = activeStateFromDrag(bead, deltaY)

    if (nextActive !== bead.active) {
      onDrag(bead, nextActive)
    }
  }

  function clearDrag(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragState.current = null
  }

  if (interactive) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={bead.active}
        className={classes}
        data-active={bead.active}
        data-bead-kind={bead.kind}
        onClick={handleClick}
        onPointerCancel={clearDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={clearDrag}
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

function activeStateFromDrag(bead: BeadState, deltaY: number): boolean {
  if (bead.kind === 'heavenly') {
    return deltaY > 0
  }

  return deltaY < 0
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
    ? 'border-amber-900 bg-gradient-to-b from-amber-200 via-orange-500 to-amber-900 shadow-lg shadow-amber-950/25'
    : 'border-stone-500 bg-gradient-to-b from-zinc-50 via-stone-300 to-zinc-500 opacity-95 shadow-sm shadow-slate-950/10'

  return [
    'absolute left-1/2 top-0 h-9 w-12 -translate-x-1/2 translate-y-[var(--bead-y)] overflow-hidden rounded-full border p-0 sm:w-16',
    'transition-[box-shadow,opacity,transform,filter] duration-150 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600',
    interactive
      ? 'touch-none cursor-grab hover:brightness-105 active:cursor-grabbing'
      : '',
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
