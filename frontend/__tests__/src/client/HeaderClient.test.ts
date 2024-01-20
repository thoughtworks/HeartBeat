import { MOCK_VERSION_URL, VERIFY_ERROR_MESSAGE, VERSION_RESPONSE } from '../fixtures';
import { headerClient } from '@src/clients/header/HeaderClient';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

const server = setupServer(rest.get(MOCK_VERSION_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))));

describe('header client', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should get response when get header status 200', async () => {
    const excepted = '1.11';
    server.use(
      rest.get(MOCK_VERSION_URL, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.Accepted), ctx.json(VERSION_RESPONSE)),
      ),
    );

    await expect(headerClient.getVersion()).resolves.toEqual(excepted);
  });

  it('should throw error when get version response status 500', () => {
    server.use(
      rest.get(MOCK_VERSION_URL, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          }),
        ),
      ),
    );

    expect(async () => {
      await headerClient.getVersion();
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });
});
