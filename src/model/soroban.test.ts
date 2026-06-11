import { describe, expect, it } from 'vitest'
import {
  clearBoard,
  createBoard,
  createRod,
  getEarthBeadCount,
  getRodDigit,
  resizeBoard,
  setBoardRodDigit,
  setEarthBead,
  setEarthBeadCount,
  setHeavenlyBead,
} from './soroban'
import { computeBoardValue, getBoardDigits } from './value'

describe('soroban rod model', () => {
  it('creates a cleared rod with the heavenly bead up and earth beads down', () => {
    const rod = createRod(0)

    expect(getRodDigit(rod)).toBe(0)
    expect(rod.heavenly).toMatchObject({
      active: false,
      position: 'away-from-bar',
      value: 5,
    })
    expect(rod.earth).toHaveLength(4)
    expect(rod.earth.every((bead) => !bead.active)).toBe(true)
    expect(rod.earth.every((bead) => bead.position === 'away-from-bar')).toBe(
      true,
    )
  })

  it('pulls adjacent earth beads toward the bar when activating a lower bead', () => {
    const rod = setEarthBead(createRod(0), 2, true)

    expect(getRodDigit(rod)).toBe(3)
    expect(getEarthBeadCount(rod)).toBe(3)
    expect(rod.earth.map((bead) => bead.active)).toEqual([
      true,
      true,
      true,
      false,
    ])
  })

  it('clears adjacent earth beads away from the bar when deactivating a bead', () => {
    const rod = setEarthBead(createRod(0, 4), 1, false)

    expect(getRodDigit(rod)).toBe(1)
    expect(getEarthBeadCount(rod)).toBe(1)
    expect(rod.earth.map((bead) => bead.active)).toEqual([
      true,
      false,
      false,
      false,
    ])
  })

  it('keeps earth bead state when toggling the heavenly bead', () => {
    const rodWithHeavenly = setHeavenlyBead(createRod(0, 3), true)

    expect(getRodDigit(rodWithHeavenly)).toBe(8)
    expect(rodWithHeavenly.heavenly.active).toBe(true)
    expect(getEarthBeadCount(rodWithHeavenly)).toBe(3)

    const rodWithoutHeavenly = setHeavenlyBead(rodWithHeavenly, false)

    expect(getRodDigit(rodWithoutHeavenly)).toBe(3)
    expect(rodWithoutHeavenly.heavenly.active).toBe(false)
    expect(getEarthBeadCount(rodWithoutHeavenly)).toBe(3)
  })

  it('rejects invalid earth bead counts', () => {
    expect(() => setEarthBeadCount(createRod(0), -1)).toThrow(RangeError)
    expect(() => setEarthBeadCount(createRod(0), 5)).toThrow(RangeError)
  })
})

describe('soroban board model', () => {
  it('sets a single rod digit without changing other rods', () => {
    const board = createBoard(3, [1, 2, 3])
    const nextBoard = setBoardRodDigit(board, 1, 9)

    expect(getBoardDigits(nextBoard)).toEqual([1, 9, 3])
    expect(getBoardDigits(board)).toEqual([1, 2, 3])
  })

  it('resizes boards while preserving existing rod state by index', () => {
    const board = createBoard(3, [7, 8, 9])
    const expanded = resizeBoard(board, 5)

    expect(getBoardDigits(expanded)).toEqual([7, 8, 9, 0, 0])
    expect(expanded.rods[0]).toBe(board.rods[0])
    expect(expanded.rods[1]).toBe(board.rods[1])
    expect(expanded.rods[2]).toBe(board.rods[2])

    const contracted = resizeBoard(expanded, 2)

    expect(getBoardDigits(contracted)).toEqual([7, 8])
    expect(contracted.rods[0]).toBe(board.rods[0])
    expect(contracted.rods[1]).toBe(board.rods[1])
  })

  it('clears every rod to zero without changing rod count', () => {
    const board = createBoard(4, [9, 8, 7, 6])
    const cleared = clearBoard(board)

    expect(cleared.rods).toHaveLength(4)
    expect(getBoardDigits(cleared)).toEqual([0, 0, 0, 0])
    expect(cleared.rods.every((rod) => !rod.heavenly.active)).toBe(true)
    expect(
      cleared.rods.every((rod) => rod.earth.every((bead) => !bead.active)),
    ).toBe(true)
  })
})

describe('value engine', () => {
  it('computes decimal values from representative rod configurations', () => {
    expect(computeBoardValue(createBoard(5, [0, 1, 5, 9, 3]))).toBe(1593)
    expect(computeBoardValue(createBoard(3, [9, 0, 4]))).toBe(904)
    expect(computeBoardValue(createBoard(1, [8]))).toBe(8)
  })

  it('reflects bead movement changes in the computed board value', () => {
    const board = createBoard(3)
    const onesSet = setBoardRodDigit(board, 2, 4)
    const tensSet = setBoardRodDigit(onesSet, 1, 6)
    const hundredsSet = setBoardRodDigit(tensSet, 0, 2)

    expect(getBoardDigits(hundredsSet)).toEqual([2, 6, 4])
    expect(computeBoardValue(hundredsSet)).toBe(264)
  })
})
