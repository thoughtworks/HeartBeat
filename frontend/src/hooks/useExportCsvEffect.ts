import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { CSVReportRequestDTO } from '@src/clients/report/dto/request';
import { csvClient } from '@src/clients/report/CSVClient';
import { MESSAGE } from '@src/constants/resources';
import { useState } from 'react';

export interface useExportCsvEffectInterface {
  fetchExportData: (params: CSVReportRequestDTO) => void;
  isExpired: boolean;
}

export const useExportCsvEffect = ({
  addNotification,
}: useNotificationLayoutEffectInterface): useExportCsvEffectInterface => {
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
        addNotification({
          message: MESSAGE.FAILED_TO_EXPORT_CSV,
          type: 'error',
        });
      }
    }
  };

  return { fetchExportData, isExpired };
};
