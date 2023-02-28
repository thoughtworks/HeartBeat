import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { MOCK_URL } from '../fixtures'
import { boardClient } from '@src/clients/BoardClient'

const server = setupServer(
  rest.get(MOCK_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)
describe('error notification', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should return 200 status when verify board success', async () => {
    const result = await boardClient.getVerifyBoard()

    expect(result.status).toEqual(200)
  })
  it('should throw error when verify board failed', async () => {
    server.use(rest.get(MOCK_URL, (req, res, ctx) => res(ctx.status(404))))

    try {
      await boardClient.getVerifyBoard()
    } catch (error) {
      expect((error as Error).message).toEqual('error')
    }
  })
})
