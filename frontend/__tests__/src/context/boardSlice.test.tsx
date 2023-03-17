import boardReducer, { updateBoard, updateBoardVerifyState } from '@src/context/config/configSlice'
import initialConfigState from '../initialConfigState'

describe('board reducer', () => {
  it('should return false when handle initial state', () => {
    const board = boardReducer(undefined, { type: 'unknown' })

    expect(board.isBoardVerified).toEqual(false)
  })

  it('should return true when handle changeBoardVerifyState given isBoardVerified is true', () => {
    const board = boardReducer(initialConfigState, updateBoardVerifyState(true))

    expect(board.isBoardVerified).toEqual(true)
  })

  it('should update board fields when change board fields input', () => {
    const board = boardReducer(initialConfigState, updateBoard({ boardId: '1' }))

    expect(board.boardConfig.boardId).toEqual('1')
  })
})
