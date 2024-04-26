import {
  MOCK_PIPELINE_VERIFY_REQUEST_PARAMS,
  MOCK_PIPELINE_GET_INFO_URL,
  MOCK_BUILD_KITE_GET_INFO_RESPONSE,
  MOCK_PIPELINE_VERIFY_URL,
} from '../fixtures';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

const server = setupServer(
  rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => {
    return res(ctx.status(HttpStatusCode.NoContent));
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('PipelineToolClient', () => {
  describe('verify pipelineTool request', () => {
    it('should isPipelineVerified is true when pipelineTool verify response status 204', async () => {
      const result = await pipelineToolClient.verify(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);

      expect(result.code).toEqual(HttpStatusCode.NoContent);
    });

    describe('Error cases', () => {
      const errorCases = [
        {
          code: HttpStatusCode.BadRequest,
        },
        {
          code: HttpStatusCode.Unauthorized,
        },
        {
          code: HttpStatusCode.Forbidden,
        },
        {
          code: HttpStatusCode.NotFound,
        },
      ];

      it.each(errorCases)('should return error code when verify endponint returns error', async ({ code }) => {
        server.use(rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => res(ctx.status(code))));

        const result = await pipelineToolClient.verify(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);

        expect(result.code).toEqual(code);
      });
    });
  });

  describe('Get pipelineTool info request', () => {
    it('should return 200 code and corresponding data when pipelineTool get info returns code 200', async () => {
      server.use(
        rest.post(MOCK_PIPELINE_GET_INFO_URL, (req, res, ctx) =>
          res(ctx.status(HttpStatusCode.Ok), ctx.json(MOCK_BUILD_KITE_GET_INFO_RESPONSE)),
        ),
      );

      const result = await pipelineToolClient.getInfo(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);

      expect(result.code).toEqual(200);
      expect(result.data).not.toBeNull();
      expect(result.errorTitle).toEqual('');
      expect(result.errorMessage).toEqual('');
    });

    describe('Error cases', () => {
      const errorMessage =
        'Please go back to the previous page and change your pipeline token with correct access permission.';
      const errorCases = [
        {
          code: HttpStatusCode.NoContent,
          errorTitle: 'No pipeline!',
          errorMessage,
        },
        {
          code: HttpStatusCode.BadRequest,
          errorTitle: 'Failed to get Pipeline configuration!',
          errorMessage,
        },
        {
          code: HttpStatusCode.Unauthorized,
          errorTitle: 'Failed to get Pipeline configuration!',
          errorMessage,
        },
        {
          code: HttpStatusCode.Forbidden,
          errorTitle: 'Failed to get Pipeline configuration!',
          errorMessage,
        },
        {
          code: HttpStatusCode.NotFound,
          errorTitle: 'Failed to get Pipeline configuration!',
          errorMessage,
        },
      ];

      it.each(errorCases)(
        `should return result with code:$code and title:$errorTitle and unify errorMessage when verify endpoint returns code:$code`,
        async ({ code, errorTitle, errorMessage }) => {
          server.use(rest.post(MOCK_PIPELINE_GET_INFO_URL, (req, res, ctx) => res(ctx.status(code))));

          const result = await pipelineToolClient.getInfo(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);

          expect(result.code).toEqual(code);
          expect(result.errorTitle).toEqual(errorTitle);
          expect(result.errorMessage).toEqual(errorMessage);
          expect(result.data).toBeUndefined();
        },
      );

      it('should return ERR_NETWORK error as its code when axios client detect network error', async () => {
        server.use(
          rest.post(MOCK_PIPELINE_GET_INFO_URL, (req, res) => {
            return res.networkError('mock network error');
          }),
        );

        const result = await pipelineToolClient.getInfo(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);

        expect(result.code).toEqual('NETWORK_TIMEOUT');
        expect(result.data).toBeUndefined();
      });

      it('should return "Unknown error" as a last resort when axios error code didn\'t match the predeifned erorr cases', async () => {
        server.use(
          rest.post(MOCK_PIPELINE_GET_INFO_URL, (req, res, ctx) => {
            return res(ctx.status(-1), ctx.body('mock error not covered by httpClient'));
          }),
        );

        const result = await pipelineToolClient.getInfo(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);

        expect(result.errorTitle).toEqual('Unknown error');
        expect(result.errorMessage).toEqual(errorMessage);
        expect(result.data).toBeUndefined();
      });
    });
  });
});
