import { MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS } from '../fixtures';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';

const server = setupServer(
  http.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, () => {
    return new HttpResponse(null, {
      status: HttpStatusCode.NoContent,
    });
  }),
);

describe('verify sourceControl request', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it('should return isSourceControlVerify true when sourceControl verify response status is 204', async () => {
    const result = await sourceControlClient.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS);

    expect(result.code).toEqual(204);
  });

  it('should set error title when sourceControl verify response status is 401', async () => {
    server.use(
      http.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, () => {
        return new HttpResponse(null, {
          status: HttpStatusCode.Unauthorized,
        });
      }),
    );

    const result = await sourceControlClient.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS);
    expect(result.code).toEqual(HttpStatusCode.Unauthorized);
    expect(result.errorTitle).toEqual('Token is incorrect!');
  });

  it('should set default error title when sourceControl verify response status 500', async () => {
    server.use(
      http.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, () => {
        return new HttpResponse(null, {
          status: HttpStatusCode.InternalServerError,
        });
      }),
    );

    const result = await sourceControlClient.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS);
    expect(result.code).toEqual(HttpStatusCode.InternalServerError);
    expect(result.errorTitle).toEqual('Unknown error');
  });
});
