import {
  DEFAULT_ROD_COUNT,
  EARTH_BEAD_COUNT,
  EARTH_BEAD_VALUE,
  HEAVENLY_BEAD_VALUE,
  MAX_ROD_DIGIT,
  MIN_ROD_DIGIT,
} from '../types/soroban'
import type {
  BoardState,
  BeadPosition,
  EarthBeadIndex,
  EarthBeadState,
  HeavenlyBeadState,
  RodDigit,
  RodState,
} from '../types/soroban'

const EARTH_BEAD_INDICES: readonly EarthBeadIndex[] = [0, 1, 2, 3]
const ROD_DIGITS: readonly RodDigit[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export function isRodDigit(value: number): value is RodDigit {
  return (
    Number.isInteger(value) && value >= MIN_ROD_DIGIT && value <= MAX_ROD_DIGIT
  )
}

export function toRodDigit(value: number): RodDigit {
  if (!isRodDigit(value)) {
    throw new RangeError(
      `Expected a rod digit from ${MIN_ROD_DIGIT} to ${MAX_ROD_DIGIT}.`,
    )
  }

  return ROD_DIGITS[value]
}

export function createBoard(
  rodCount = DEFAULT_ROD_COUNT,
  digits: readonly number[] = [],
): BoardState {
  if (!Number.isInteger(rodCount) || rodCount < 1) {
    throw new RangeError('Expected rod count to be a positive integer.')
  }

  return {
    rods: Array.from({ length: rodCount }, (_, index) =>
      createRod(index, digits[index] ?? MIN_ROD_DIGIT),
    ),
  }
}

export function clearBoard(board: BoardState): BoardState {
  return {
    rods: board.rods.map(clearRod),
  }
}

export function resizeBoard(board: BoardState, rodCount: number): BoardState {
  if (!Number.isInteger(rodCount) || rodCount < 1) {
    throw new RangeError('Expected rod count to be a positive integer.')
  }

  if (board.rods.length === rodCount) {
    return board
  }

  return {
    rods: Array.from(
      { length: rodCount },
      (_, index) => board.rods[index] ?? createRod(index),
    ),
  }
}

export function setBoardRodDigit(
  board: BoardState,
  rodIndex: number,
  digit: number,
): BoardState {
  return {
    rods: board.rods.map((rod) =>
      rod.index === rodIndex ? setRodDigit(rod, digit) : rod,
    ),
  }
}

export function createRod(
  index: number,
  digit: number = MIN_ROD_DIGIT,
): RodState {
  if (!Number.isInteger(index) || index < 0) {
    throw new RangeError('Expected rod index to be a non-negative integer.')
  }

  return setRodDigit(
    {
      id: `rod-${index}`,
      index,
      heavenly: createHeavenlyBead(index, false),
      earth: EARTH_BEAD_INDICES.map((earthIndex) =>
        createEarthBead(index, earthIndex, false),
      ),
    },
    digit,
  )
}

export function clearRod(rod: RodState): RodState {
  return setRodDigit(rod, MIN_ROD_DIGIT)
}

export function setRodDigit(rod: RodState, digit: number): RodState {
  const nextDigit = toRodDigit(digit)
  const heavenlyActive = nextDigit >= HEAVENLY_BEAD_VALUE
  const earthActiveCount = nextDigit % HEAVENLY_BEAD_VALUE

  return {
    ...rod,
    heavenly: setHeavenlyBeadState(rod.heavenly, heavenlyActive),
    earth: EARTH_BEAD_INDICES.map((earthIndex) =>
      createEarthBead(rod.index, earthIndex, earthIndex < earthActiveCount),
    ),
  }
}

export function getRodDigit(rod: RodState): RodDigit {
  const heavenlyValue = rod.heavenly.active ? HEAVENLY_BEAD_VALUE : 0
  const earthValue = getEarthBeadCount(rod)

  return toRodDigit(heavenlyValue + earthValue)
}

export function setHeavenlyBead(rod: RodState, active: boolean): RodState {
  const currentDigit = getRodDigit(rod)
  const earthValue = currentDigit % HEAVENLY_BEAD_VALUE
  const nextDigit = active ? HEAVENLY_BEAD_VALUE + earthValue : earthValue

  return setRodDigit(rod, nextDigit)
}

export function setEarthBeadCount(
  rod: RodState,
  activeCount: number,
): RodState {
  if (
    !Number.isInteger(activeCount) ||
    activeCount < 0 ||
    activeCount > EARTH_BEAD_COUNT
  ) {
    throw new RangeError(
      `Expected earth bead count from 0 to ${EARTH_BEAD_COUNT}.`,
    )
  }

  const heavenlyValue = rod.heavenly.active ? HEAVENLY_BEAD_VALUE : 0

  return setRodDigit(rod, heavenlyValue + activeCount)
}

export function setEarthBead(
  rod: RodState,
  beadIndex: EarthBeadIndex,
  active: boolean,
): RodState {
  const activeCount = active ? beadIndex + 1 : beadIndex

  return setEarthBeadCount(rod, activeCount)
}

export function getEarthBeadCount(rod: RodState): number {
  return rod.earth.filter((bead) => bead.active).length
}

export function isRodCleared(rod: RodState): boolean {
  return getRodDigit(rod) === MIN_ROD_DIGIT
}

function createHeavenlyBead(
  rodIndex: number,
  active: boolean,
): HeavenlyBeadState {
  return {
    id: `rod-${rodIndex}-heavenly`,
    kind: 'heavenly',
    value: HEAVENLY_BEAD_VALUE,
    active,
    position: heavenlyPosition(active),
  }
}

function createEarthBead(
  rodIndex: number,
  index: EarthBeadIndex,
  active: boolean,
): EarthBeadState {
  return {
    id: `rod-${rodIndex}-earth-${index}`,
    kind: 'earth',
    index,
    value: EARTH_BEAD_VALUE,
    active,
    position: earthPosition(active),
  }
}

function setHeavenlyBeadState(
  bead: HeavenlyBeadState,
  active: boolean,
): HeavenlyBeadState {
  return {
    ...bead,
    active,
    position: heavenlyPosition(active),
  }
}

function heavenlyPosition(active: boolean): BeadPosition {
  return active ? 'toward-bar' : 'away-from-bar'
}

function earthPosition(active: boolean): BeadPosition {
  return active ? 'toward-bar' : 'away-from-bar'
}
