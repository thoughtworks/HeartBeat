import { setupServer } from 'msw/node'
import { rest } from 'msw'
import {
  JIRA_VERIFY_ERROR_MESSAGE,
  MOCK_BOARD_URL_FOR_CLASSIC_JIRA,
  MOCK_BOARD_URL_FOR_JIRA,
  MOCK_BOARD_VERIFY_REQUEST_PARAMS,
  MOCK_CLASSIC_JIRA_BOARD_VERIFY_REQUEST_PARAMS,
} from '../fixtures'
import { boardClient } from '@src/clients/BoardClient'
import { HttpStatusCode } from 'axios'

const server = setupServer(
  rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))),
  rest.get(MOCK_BOARD_URL_FOR_CLASSIC_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok)))
)

describe('error notification', () => {
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

    expect(result.isNoDoneCard).toEqual(true)
    expect(result.isBoardVerify).toEqual(false)
  })

  it('should throw error when board verify response status 400', async () => {
    server.use(rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.BadRequest))))

    boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(JIRA_VERIFY_ERROR_MESSAGE.BAD_REQUEST)
    })
  })

  it('should throw error when board verify response status 401', async () => {
    server.use(rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.Unauthorized))))

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS)
    }).rejects.toThrow(JIRA_VERIFY_ERROR_MESSAGE.UNAUTHORIZED)
  })

  it('should throw error when board verify response status 500', async () => {
    server.use(
      rest.get(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.InternalServerError)))
    )

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS)
    }).rejects.toThrow(JIRA_VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
  })
})
