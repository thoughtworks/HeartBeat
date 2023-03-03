import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BUILD_KITE_VERIFY_FAILED_MESSAGE, MOCK_PIPELINE_URL, MOCK_URL, PIPELINE_TOOL_TYPES } from '../fixtures'
import { pipelineToolClient } from '@src/clients/PipelineToolClient'

const server = setupServer(
  rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)
export const mockParams = {
  token: 'mockToken',
  type: PIPELINE_TOOL_TYPES.BUILD_KITE,
  startTime: '1613664000000',
  endTime: '1614873600000',
}
describe('error notification', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should isPipelineVerified is true when pipelineTool verify response status 200', async () => {
    const result = await pipelineToolClient.verifyPipelineTool(mockParams)

    expect(result.isPipelineToolVerified).toEqual(true)
  })

  it('should throw error when pipelineTool verify response status 404', async () => {
    server.use(rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => res(ctx.status(404))))

    try {
      await pipelineToolClient.verifyPipelineTool(mockParams)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(BUILD_KITE_VERIFY_FAILED_MESSAGE)
    }
  })

  it('should throw error when pipelineTool verify response status 500', async () => {
    server.use(rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => res(ctx.status(500))))

    try {
      await pipelineToolClient.verifyPipelineTool(mockParams)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(BUILD_KITE_VERIFY_FAILED_MESSAGE)
    }
  })
})
