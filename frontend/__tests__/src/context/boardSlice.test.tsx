import boardReducer, { updateBoardVerifyState } from '@src/context/board/boardSlice'

describe('board reducer', () => {
  it('should return false when handle initial state', () => {
    const steeper = boardReducer(undefined, { type: 'unknown' })

    expect(steeper.isBoardVerified).toEqual(false)
  })

  it('should return true when handle changeBoardVerifyState given isBoardVerified is true', () => {
    const steeper = boardReducer(
      {
        isBoardVerified: false,
      },
      updateBoardVerifyState(true)
    )

    expect(steeper.isBoardVerified).toEqual(true)
  })
})
