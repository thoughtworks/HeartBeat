import { MOCK_EXPORT_CSV_REQUEST_PARAMS, MOCK_EXPORT_CSV_URL, VERIFY_ERROR_MESSAGE } from '../fixtures';
import { csvClient } from '@src/clients/report/CSVClient';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';

const server = setupServer(
  http.get(MOCK_EXPORT_CSV_URL, () => {
    return new HttpResponse(null, {
      status: HttpStatusCode.NoContent,
    });
  }),
);

describe('verify export csv', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it('should download the pipeline CSV file when export csv request status 200', async () => {
    const mockBlob = new Blob([''], { type: 'application/octet-stream' });
    const mockResponse = { data: mockBlob };
    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    const mockCreateObjectURL = jest.fn().mockImplementation((blob) => {
      return `mock-url:${blob}`;
    });
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    window.URL.createObjectURL = mockCreateObjectURL;

    const mockAxiosInstance = { get: mockGet };
    await csvClient.exportCSVData.call({ axiosInstance: mockAxiosInstance }, MOCK_EXPORT_CSV_REQUEST_PARAMS);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('should throw error when export csv request status 500', async () => {
    server.use(
      http.get(MOCK_EXPORT_CSV_URL, () => {
        return new HttpResponse(null, {
          status: HttpStatusCode.InternalServerError,
          statusText: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        });
      }),
    );

    await expect(async () => {
      await csvClient.exportCSVData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });
});
