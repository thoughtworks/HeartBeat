import { verifyBoard } from '@src/services/boardService'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    return res(ctx.status(200))
  })
)
describe('config step', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())
  it('should return 200 status when verifyBoard is succeed', async () => {
    const result = await verifyBoard()
    expect(result.status).toEqual(200)
  })
})
