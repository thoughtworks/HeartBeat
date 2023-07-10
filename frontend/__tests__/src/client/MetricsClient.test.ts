import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { metricsClient } from '@src/clients/MetricsClient'
import { BASE_URL, MOCK_GET_STEPS_PARAMS, VERIFY_ERROR_MESSAGE } from '../fixtures'
import { HttpStatusCode } from 'axios'

describe('get steps from metrics response', () => {
  const { params, buildId, organizationId, pipelineType, token } = MOCK_GET_STEPS_PARAMS
  const getStepsUrl = `${BASE_URL}/pipelines/:type/:orgId/pipelines/:buildId/steps`
  const server = setupServer(
    rest.get(getStepsUrl, (req, res, ctx) => {
      return res(ctx.status(HttpStatusCode.Ok), ctx.json({ steps: ['step1'] }))
    })
  )
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should return steps when getSteps response status 200', async () => {
    const result = await metricsClient.getSteps(params, buildId, organizationId, pipelineType, token)

    expect(result).toEqual(['step1'])
  })

  it('should throw error when getSteps response status 500', async () => {
    server.use(
      rest.get(getStepsUrl, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR })
        )
      )
    )

    await expect(async () => {
      await metricsClient.getSteps(params, buildId, organizationId, pipelineType, token)
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
  })

  it('should throw error when getSteps response status 400', async () => {
    server.use(
      rest.get(getStepsUrl, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.BadRequest), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST }))
      )
    )

    await expect(async () => {
      await metricsClient.getSteps(params, buildId, organizationId, pipelineType, token)
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.BAD_REQUEST)
  })
})
