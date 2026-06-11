import { getRodDigit } from './soroban'
import type { BoardState, RodDigit } from '../types/soroban'

export function getBoardDigits(board: BoardState): readonly RodDigit[] {
  return board.rods.map(getRodDigit)
}

export function computeBoardValue(board: BoardState): number {
  return getBoardDigits(board).reduce<number>(
    (total, digit) => total * 10 + digit,
    0,
  )
}
