import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { ERROR_MESSAGE, MOCK_BOARD_URL, mockBoardVerifyRequestParams } from '../fixtures'
import { boardClient } from '@src/clients/BoardClient'

const server = setupServer(
  rest.get(MOCK_BOARD_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

describe('error notification', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should isBoardVerify is true when board verify response status 200', async () => {
    const result = await boardClient.getVerifyBoard(mockBoardVerifyRequestParams)

    expect(result.isBoardVerify).toEqual(true)
  })

  it('should isNoDoneCard is true when board verify response status 204', async () => {
    server.use(rest.get(MOCK_BOARD_URL, (req, res, ctx) => res(ctx.status(204))))

    const result = await boardClient.getVerifyBoard(mockBoardVerifyRequestParams)

    expect(result.isNoDoneCard).toEqual(true)
    expect(result.isBoardVerify).toEqual(false)
  })

  it('should throw error when board verify response status 400', async () => {
    server.use(rest.get(MOCK_BOARD_URL, (req, res, ctx) => res(ctx.status(400))))

    try {
      await boardClient.getVerifyBoard(mockBoardVerifyRequestParams)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(ERROR_MESSAGE[400])
    }
  })

  it('should throw error when board verify response status 404', async () => {
    server.use(rest.get(MOCK_BOARD_URL, (req, res, ctx) => res(ctx.status(404))))

    try {
      await boardClient.getVerifyBoard(mockBoardVerifyRequestParams)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(ERROR_MESSAGE[404])
    }
  })

  it('should throw error when board verify response status 500', async () => {
    server.use(rest.get(MOCK_BOARD_URL, (req, res, ctx) => res(ctx.status(500))))

    try {
      await boardClient.getVerifyBoard(mockBoardVerifyRequestParams)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(ERROR_MESSAGE[500])
    }
  })
})
