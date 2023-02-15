import boardReducer, { changeBoardVerifyState } from '@src/features/board/boardSlice'

describe('board reducer', () => {
  it('should false when handle initial state', () => {
    const STEPPER = boardReducer(undefined, { type: 'unknown' })

    expect(STEPPER.isBoardVerified).toEqual(false)
  })

  it('should true when handle changeBoardVerifyState given isBoardVerified is true', () => {
    const STEPPER = boardReducer(
      {
        isBoardVerified: false,
      },
      changeBoardVerifyState(true)
    )

    expect(STEPPER.isBoardVerified).toEqual(true)
  })
})
