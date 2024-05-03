import { MOCK_VERSION_URL, VERIFY_ERROR_MESSAGE, VERSION_RESPONSE } from '../fixtures';
import { headerClient } from '@src/clients/header/HeaderClient';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';

const server = setupServer(
  http.get(MOCK_VERSION_URL, () => {
    return new HttpResponse(null, {
      status: HttpStatusCode.Ok,
    });
  }),
);

describe('header client', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should get response when get header status 200', async () => {
    const excepted = '1.11';
    server.use(
      http.get(MOCK_VERSION_URL, () => {
        return new HttpResponse(JSON.stringify(VERSION_RESPONSE), {
          status: HttpStatusCode.Accepted,
        });
      }),
    );

    await expect(headerClient.getVersion()).resolves.toEqual(excepted);
  });

  it('should throw error when get version response status 500', () => {
    server.use(
      http.get(MOCK_VERSION_URL, () => {
        return new HttpResponse(
          JSON.stringify({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          }),
          {
            status: HttpStatusCode.InternalServerError,
          },
        );
      }),
    );

    expect(async () => {
      await headerClient.getVersion();
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });
});
