import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { MOCK_GENERATE_REPORT_REQUEST_PARAMS, MOCK_REPORT_URL, VERIFY_ERROR_MESSAGE } from '../fixtures'
import { HttpStatusCode } from 'axios'
import { reportClient } from '@src/clients/report/ReportClient'

const server = setupServer(rest.post(MOCK_REPORT_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))))

describe('report client', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should get response when generate report request status 200', async () => {
    const result = await reportClient.report(MOCK_GENERATE_REPORT_REQUEST_PARAMS)

    expect(result.response).not.toBeNull()
  })

  it('should throw error when generate report response status 500', async () => {
    server.use(
      rest.post(MOCK_REPORT_URL, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          })
        )
      )
    )

    await expect(async () => {
      await reportClient.report(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
  })

  it('should throw error when generate report response status 400', async () => {
    server.use(
      rest.post(MOCK_REPORT_URL, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.BadRequest),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST,
          })
        )
      )
    )

    await expect(async () => {
      await reportClient.report(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.BAD_REQUEST)
  })
})
