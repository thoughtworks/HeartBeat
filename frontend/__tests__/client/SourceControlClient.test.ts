import {
  MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL,
  MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS,
  VERIFY_ERROR_MESSAGE,
} from '../fixtures';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

const server = setupServer(rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) => res(ctx.status(204))));

describe('verify sourceControl request', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it('should return isSourceControlVerify true when sourceControl verify response status is 204', async () => {
    const result = await sourceControlClient.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS);

    expect(result.code).toEqual(204);
  });

  it('should throw error when sourceControl verify response status is 400', () => {
    server.use(
      rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.BadRequest), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST })),
      ),
    );

    sourceControlClient.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toMatch(VERIFY_ERROR_MESSAGE.BAD_REQUEST);
    });
  });

  it('should throw error when sourceControl verify response status is 404', async () => {
    server.use(
      rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.NotFound), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.NOT_FOUND })),
      ),
    );

    sourceControlClient.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toMatch(VERIFY_ERROR_MESSAGE.NOT_FOUND);
    });
  });

  it('should throw error when sourceControl verify response status 500', async () => {
    server.use(
      rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          }),
        ),
      ),
    );

    sourceControlClient.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toMatch(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
    });
  });
});
