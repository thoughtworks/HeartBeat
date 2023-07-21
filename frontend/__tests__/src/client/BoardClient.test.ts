import { setupServer } from 'msw/node'
import { rest } from 'msw'
import {
  MOCK_BOARD_URL_FOR_CLASSIC_JIRA,
  MOCK_BOARD_URL_FOR_JIRA,
  MOCK_BOARD_VERIFY_REQUEST_PARAMS,
  MOCK_CLASSIC_JIRA_BOARD_VERIFY_REQUEST_PARAMS,
  VERIFY_ERROR_MESSAGE,
} from '../fixtures'
import { boardClient } from '@src/clients/board/BoardClient'
import { HttpStatusCode } from 'axios'
import { UNKNOWN_EXCEPTION } from '@src/constants'

const server = setupServer(
  rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))),
  rest.get(MOCK_BOARD_URL_FOR_CLASSIC_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok)))
)

describe('verify board request', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should isBoardVerify is true when board verify response status 200', async () => {
    const result = await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS)

    expect(result.isBoardVerify).toEqual(true)
  })

  it('should isBoardVerify is true when select classic jira and board verify response status 200', async () => {
    const result = await boardClient.getVerifyBoard(MOCK_CLASSIC_JIRA_BOARD_VERIFY_REQUEST_PARAMS)

    expect(result.isBoardVerify).toEqual(true)
  })

  it('should isNoDoneCard is true when board verify response status 204', async () => {
    server.use(rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.NoContent))))

    const result = await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS)

    expect(result.haveDoneCard).toEqual(false)
    expect(result.isBoardVerify).toEqual(false)
  })

  it('should throw error when board verify response status 400', async () => {
    server.use(
      rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.BadRequest), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST }))
      )
    )

    boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(VERIFY_ERROR_MESSAGE.BAD_REQUEST)
    })
  })

  it('should throw error when board verify response status 401', async () => {
    server.use(
      rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.Unauthorized), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.UNAUTHORIZED }))
      )
    )

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS)
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.UNAUTHORIZED)
  })

  it('should throw unknown exception when board verify response empty', async () => {
    server.use(rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res) => res.networkError('Network Error')))
    boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(UNKNOWN_EXCEPTION)
    })
  })

  it('should throw unknown exception when board verify response status 300', async () => {
    server.use(rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.MultipleChoices))))

    boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(VERIFY_ERROR_MESSAGE.UNKNOWN)
    })
  })

  it('should throw unknown exception when board verify response status 5xx', async () => {
    server.use(
      rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.InternalServerError)))
    )

    boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(UNKNOWN_EXCEPTION)
    })
  })
})
