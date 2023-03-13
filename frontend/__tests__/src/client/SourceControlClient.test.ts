import { setupServer } from 'msw/node'
import { rest } from 'msw'
import {
  GITHUB_VERIFY_ERROR_MESSAGE,
  MOCK_SOURCE_CONTROL_URL,
  MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS,
} from '../fixtures'
import { sourceControlClient } from '@src/clients/SourceControlClient'
import { HttpStatusCode } from 'axios'

const server = setupServer(rest.get(MOCK_SOURCE_CONTROL_URL, (req, res, ctx) => res(ctx.status(200))))

describe('verify sourceControl request', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should return isSourceControlVerify true when sourceControl verify response status is 200', async () => {
    const result = await sourceControlClient.getVerifySourceControl(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS)

    expect(result.isSourceControlVerify).toEqual(true)
  })

  it('should throw error when sourceControl verify response status is 400', () => {
    server.use(rest.get(MOCK_SOURCE_CONTROL_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.BadRequest))))

    sourceControlClient.getVerifySourceControl(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(GITHUB_VERIFY_ERROR_MESSAGE.BAD_REQUEST)
    })
  })

  it('should throw error when sourceControl verify response status is 404', async () => {
    server.use(rest.get(MOCK_SOURCE_CONTROL_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Unauthorized))))

    sourceControlClient.getVerifySourceControl(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(GITHUB_VERIFY_ERROR_MESSAGE.UNAUTHORIZED)
    })
  })

  it('should throw error when sourceControl verify response status 500', async () => {
    server.use(
      rest.get(MOCK_SOURCE_CONTROL_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.InternalServerError)))
    )

    sourceControlClient.getVerifySourceControl(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(GITHUB_VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
    })
  })
})
