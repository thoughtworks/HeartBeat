import {
  MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  MOCK_REPORT_RESPONSE,
  MOCK_RETRIEVE_REPORT_RESPONSE,
  VERIFY_ERROR_MESSAGE,
} from '../fixtures';
import { reportClient } from '@src/clients/report/ReportClient';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';

const MOCK_REPORT_URL = 'http://localhost/api/v1/reports';
const server = setupServer(
  http.post(MOCK_REPORT_URL, () => {
    return new HttpResponse(null, {
      status: HttpStatusCode.Ok,
    });
  }),
  http.get(MOCK_REPORT_URL, () => {
    return new HttpResponse(null, {
      status: HttpStatusCode.Ok,
    });
  }),
);

describe('report client', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should get response when generate report request status 202', async () => {
    const excepted = MOCK_RETRIEVE_REPORT_RESPONSE;
    server.use(
      http.post(MOCK_REPORT_URL, () => {
        return new HttpResponse(JSON.stringify(MOCK_RETRIEVE_REPORT_RESPONSE), {
          status: HttpStatusCode.Accepted,
        });
      }),
    );

    await expect(reportClient.retrieveByUrl(MOCK_GENERATE_REPORT_REQUEST_PARAMS, '/reports')).resolves.toStrictEqual(
      excepted,
    );
  });

  it('should throw error when generate report response status 500', async () => {
    server.use(
      http.post(MOCK_REPORT_URL, () => {
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

    await expect(async () => {
      await reportClient.retrieveByUrl(MOCK_GENERATE_REPORT_REQUEST_PARAMS, '/reports');
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });

  it('should throw error when generate report response status 400', async () => {
    server.use(
      http.post(MOCK_REPORT_URL, () => {
        return new HttpResponse(
          JSON.stringify({
            hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST,
          }),
          {
            status: HttpStatusCode.BadRequest,
          },
        );
      }),
    );

    await expect(async () => {
      await reportClient.retrieveByUrl(MOCK_GENERATE_REPORT_REQUEST_PARAMS, '/reports');
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.BAD_REQUEST);
  });

  it('should throw error when calling pollingReport given response status 500', () => {
    server.use(
      http.get(MOCK_REPORT_URL, () => {
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
      await reportClient.polling(MOCK_REPORT_URL);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });

  it('should return status and response when calling pollingReport given response status 201', async () => {
    const excepted = {
      status: HttpStatusCode.Created,
      response: MOCK_REPORT_RESPONSE,
    };
    server.use(
      http.get(MOCK_REPORT_URL, () => {
        return new HttpResponse(JSON.stringify(MOCK_REPORT_RESPONSE), {
          status: HttpStatusCode.Created,
        });
      }),
    );

    await expect(reportClient.polling(MOCK_REPORT_URL)).resolves.toEqual(excepted);
  });
});
