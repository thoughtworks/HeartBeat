import { BASE_URL, MOCK_GET_STEPS_PARAMS, VERIFY_ERROR_MESSAGE } from '../fixtures';
import { metricsClient } from '@src/clients/MetricsClient';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

describe('get steps from metrics response', () => {
  const { params, buildId, organizationId, pipelineType, token } = MOCK_GET_STEPS_PARAMS;
  const getStepsUrl = `${BASE_URL}/pipelines/:type/:orgId/pipelines/:buildId/steps`;
  const server = setupServer();
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it('should return steps when getSteps response status 200', async () => {
    server.use(
      rest.get(getStepsUrl, (req, res, ctx) => {
        return res(ctx.status(HttpStatusCode.Ok), ctx.json({ steps: ['step1'] }));
      }),
    );

    const result = await metricsClient.getSteps(params[0], buildId, organizationId, pipelineType, token);

    expect(result).toEqual({ response: ['step1'], haveStep: true });
  });

  it('should throw error when getSteps response status 500', async () => {
    server.use(
      rest.get(getStepsUrl, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          }),
        ),
      ),
    );

    await expect(async () => {
      await metricsClient.getSteps(params[0], buildId, organizationId, pipelineType, token);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });

  it('should throw error when getSteps response status 400', async () => {
    server.use(
      rest.get(getStepsUrl, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.BadRequest), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST })),
      ),
    );

    await expect(async () => {
      await metricsClient.getSteps(params[0], buildId, organizationId, pipelineType, token);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.BAD_REQUEST);
  });

  it('should show isNoStep True when getSteps response status 204', async () => {
    server.use(rest.get(getStepsUrl, (req, res, ctx) => res(ctx.status(HttpStatusCode.NoContent))));

    const result = await metricsClient.getSteps(params[0], buildId, organizationId, pipelineType, token);

    expect(result).toEqual({ branches: [], response: [], haveStep: false, pipelineCrews: [] });
  });
});
