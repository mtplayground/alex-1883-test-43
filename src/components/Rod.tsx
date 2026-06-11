import { setEarthBead, setHeavenlyBead } from '../model/soroban'
import type { BeadState, RodState } from '../types/soroban'
import { Bead } from './Bead'

export interface RodProps {
  rod: RodState
  className?: string
  disabled?: boolean
  onChange?: (rod: RodState) => void
  showReckoningBar?: boolean
}

export function Rod({
  rod,
  className,
  disabled = false,
  onChange,
  showReckoningBar = true,
}: RodProps) {
  const interactive = Boolean(onChange) && !disabled

  function handleBeadPress(bead: BeadState) {
    if (!onChange || disabled) {
      return
    }

    onChange(nextRodAfterBeadPress(rod, bead))
  }

  function handleBeadDrag(bead: BeadState, active: boolean) {
    if (!onChange || disabled) {
      return
    }

    onChange(nextRodAfterBeadDrag(rod, bead, active))
  }

  return (
    <div
      aria-disabled={disabled || undefined}
      aria-label={`Rod ${rod.index + 1}`}
      className={rodClassName(disabled, className)}
      data-rod-index={rod.index}
      role="group"
    >
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-1/2 top-4 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-slate-500 via-slate-800 to-slate-500 shadow-sm"
      />
      {showReckoningBar ? (
        <div
          aria-hidden="true"
          className="absolute left-2 right-2 top-28 z-20 h-3 -translate-y-1/2 rounded bg-gradient-to-b from-slate-700 to-slate-950 shadow-sm"
        />
      ) : null}
      <div className="absolute left-0 right-0 top-28 h-0">
        <Bead
          bead={rod.heavenly}
          className="z-10"
          onDrag={interactive ? handleBeadDrag : undefined}
          onPress={interactive ? handleBeadPress : undefined}
        />
        {rod.earth.map((bead) => (
          <Bead
            bead={bead}
            className="z-10"
            key={bead.id}
            onDrag={interactive ? handleBeadDrag : undefined}
            onPress={interactive ? handleBeadPress : undefined}
          />
        ))}
      </div>
    </div>
  )
}

function nextRodAfterBeadPress(rod: RodState, bead: BeadState): RodState {
  if (bead.kind === 'heavenly') {
    return setHeavenlyBead(rod, !bead.active)
  }

  return setEarthBead(rod, bead.index, !bead.active)
}

function nextRodAfterBeadDrag(
  rod: RodState,
  bead: BeadState,
  active: boolean,
): RodState {
  if (bead.kind === 'heavenly') {
    return setHeavenlyBead(rod, active)
  }

  return setEarthBead(rod, bead.index, active)
}

function rodClassName(disabled: boolean, className?: string): string {
  return [
    'relative h-[21rem] w-16 shrink-0 select-none rounded-md border border-slate-200 sm:h-[22rem] sm:w-24',
    'bg-gradient-to-b from-stone-100 via-white to-stone-100',
    disabled ? 'opacity-60' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
