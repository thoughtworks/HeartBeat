import {
  MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  MOCK_REPORT_RESPONSE,
  MOCK_RETRIEVE_REPORT_RESPONSE,
  VERIFY_ERROR_MESSAGE,
} from '../fixtures';
import { reportClient } from '@src/clients/report/ReportClient';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

const MOCK_REPORT_URL = 'http://localhost/api/v1/reports';
const server = setupServer(
  rest.post(MOCK_REPORT_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))),
  rest.get(MOCK_REPORT_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))),
);

describe('report client', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should get response when generate report request status 202', async () => {
    const excepted = MOCK_RETRIEVE_REPORT_RESPONSE;

    server.use(
      rest.post(MOCK_REPORT_URL, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.Accepted), ctx.json(MOCK_RETRIEVE_REPORT_RESPONSE)),
      ),
    );

    await expect(reportClient.retrieveByUrl(MOCK_GENERATE_REPORT_REQUEST_PARAMS, '/reports')).resolves.toStrictEqual(
      excepted,
    );
  });

  it('should throw error when generate report response status 500', async () => {
    server.use(
      rest.post(MOCK_REPORT_URL, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          }),
        ),
      ),
    );

    await expect(async () => {
      await reportClient.retrieveByUrl(MOCK_GENERATE_REPORT_REQUEST_PARAMS, '/reports');
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });

  it('should throw error when generate report response status 400', async () => {
    server.use(
      rest.post(MOCK_REPORT_URL, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.BadRequest),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST,
          }),
        ),
      ),
    );

    await expect(async () => {
      await reportClient.retrieveByUrl(MOCK_GENERATE_REPORT_REQUEST_PARAMS, '/reports');
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.BAD_REQUEST);
  });

  it('should throw error when calling pollingReport given response status 500', () => {
    server.use(
      rest.get(MOCK_REPORT_URL, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          }),
        ),
      ),
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
      rest.get(MOCK_REPORT_URL, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.Created), ctx.json(MOCK_REPORT_RESPONSE)),
      ),
    );

    await expect(reportClient.polling(MOCK_REPORT_URL)).resolves.toEqual(excepted);
  });
});
