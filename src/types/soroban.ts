export const HEAVENLY_BEAD_VALUE = 5
export const EARTH_BEAD_VALUE = 1
export const EARTH_BEAD_COUNT = 4
export const MIN_ROD_DIGIT = 0
export const MAX_ROD_DIGIT = 9
export const DEFAULT_ROD_COUNT = 5

export type BeadKind = 'heavenly' | 'earth'
export type BeadPosition = 'toward-bar' | 'away-from-bar'
export type EarthBeadIndex = 0 | 1 | 2 | 3
export type RodDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

interface BaseBeadState {
  id: string
  active: boolean
  position: BeadPosition
}

export interface HeavenlyBeadState extends BaseBeadState {
  kind: 'heavenly'
  value: typeof HEAVENLY_BEAD_VALUE
}

export interface EarthBeadState extends BaseBeadState {
  kind: 'earth'
  index: EarthBeadIndex
  value: typeof EARTH_BEAD_VALUE
}

export type BeadState = HeavenlyBeadState | EarthBeadState

export interface RodState {
  id: string
  index: number
  heavenly: HeavenlyBeadState
  earth: readonly EarthBeadState[]
}

export interface BoardState {
  rods: readonly RodState[]
}
