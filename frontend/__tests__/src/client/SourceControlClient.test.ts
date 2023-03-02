import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { SOURCE_CONTROL_TYPES } from '../fixtures'
import { sourceControlClient } from '@src/clients/SourceControlClient'

const server = setupServer(
  rest.get('/api/v1/codebase/fetch/repos', (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

export const mockParams = {
  type: SOURCE_CONTROL_TYPES.GIT_HUB,
  token: 'mockToken',
}

describe('verify sourceControl request', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should isSourceControlVerify is true when sourceControl verify response status is 200', async () => {
    const result = await sourceControlClient.getVerifySourceControl(mockParams)

    expect(result.isSourceControlVerify).toEqual(true)
  })
})
