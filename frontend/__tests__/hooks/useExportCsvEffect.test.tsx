import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { addNotification } from '@src/context/notification/NotificationSlice';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect';
import { MOCK_EXPORT_CSV_REQUEST_PARAMS } from '../fixtures';
import { csvClient } from '@src/clients/report/CSVClient';
import { act, renderHook } from '@testing-library/react';
import { setupStore } from '@test/utils/setupStoreUtil';
import { Provider } from 'react-redux';
import { HttpStatusCode } from 'axios';

jest.mock('@src/context/notification/NotificationSlice', () => ({
  ...jest.requireActual('@src/context/notification/NotificationSlice'),
  addNotification: jest.fn().mockReturnValue({ type: 'ADD_NOTIFICATION' }),
}));

describe('use export csv effect', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const setup = () => {
    const store = setupStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <ContextProvider>{children}</ContextProvider>
      </Provider>
    );
    return renderHook(() => useExportCsvEffect(), { wrapper });
  };

  it('should call addNotification when export csv response status 500', async () => {
    csvClient.exportCSVData = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message', HttpStatusCode.InternalServerError, 'fake description');
    });
    const { result } = setup();

    act(() => {
      result.current.fetchExportData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
    });

    expect(addNotification).toBeCalledWith({
      message: 'Failed to export csv.',
      type: 'error',
    });
  });

  it('should set isExpired true when export csv response status 404', async () => {
    csvClient.exportCSVData = jest.fn().mockImplementation(() => {
      throw new NotFoundException('error message', HttpStatusCode.NotFound, 'fake description');
    });
    const { result } = setup();

    act(() => {
      result.current.fetchExportData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
    });

    expect(result.current.isExpired).toEqual(true);
  });
});
