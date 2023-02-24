import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { boardService } from '@src/services/BoardService'
import { AxiosError, AxiosResponse } from 'axios'
import { MOCK_URL } from '../fixtures'

const server = setupServer(
  rest.get(MOCK_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

const errorServer = setupServer(
  rest.get(MOCK_URL, (req, res, ctx) => {
    return res(
      ctx.status(403),
      ctx.json({
        errorMessage: 'error message',
      })
    )
  })
)

describe('board service successfully', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())
  it('should return 200 status when verifyBoard is succeed', async () => {
    const result = (await boardService.getVerifyBoard()) as AxiosResponse
    expect(result.status).toEqual(200)
  })
})

describe('board service failed', () => {
  beforeAll(() => errorServer.listen())
  afterAll(() => errorServer.close())
  it('should show error message when verifyBoard is failed', async () => {
    const result = (await boardService.getVerifyBoard()) as AxiosError
    expect(result.response?.status).toEqual(403)
  })
})
