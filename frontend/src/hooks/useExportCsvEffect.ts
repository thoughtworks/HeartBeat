import { addNotification } from '@src/context/notification/NotificationSlice';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { CSVReportRequestDTO } from '@src/clients/report/dto/request';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { csvClient } from '@src/clients/report/CSVClient';
import { MESSAGE } from '@src/constants/resources';
import { useState } from 'react';

export interface useExportCsvEffectInterface {
  fetchExportData: (params: CSVReportRequestDTO) => void;
  isExpired: boolean;
}

export const useExportCsvEffect = (): useExportCsvEffectInterface => {
  const dispatch = useAppDispatch();
  const [isExpired, setIsExpired] = useState(false);

  const fetchExportData = async (params: CSVReportRequestDTO) => {
    try {
      setIsExpired(false);
      return await csvClient.exportCSVData(params);
    } catch (e) {
      const err = e as Error;
      if (err instanceof NotFoundException) {
        setIsExpired(true);
      } else {
        dispatch(
          addNotification({
            message: MESSAGE.FAILED_TO_EXPORT_CSV,
            type: 'error',
          }),
        );
      }
    }
  };

  return { fetchExportData, isExpired };
};
