import { NotFoundException } from '@src/exceptions/NotFoundException';
import { CSVReportRequestDTO } from '@src/clients/report/dto/request';
import { csvClient } from '@src/clients/report/CSVClient';
import { DURATION } from '@src/constants/commons';
import { useState } from 'react';

export interface useExportCsvEffectInterface {
  fetchExportData: (params: CSVReportRequestDTO) => void;
  errorMessage: string;
  isExpired: boolean;
}

export const useExportCsvEffect = (): useExportCsvEffectInterface => {
  const [errorMessage, setErrorMessage] = useState('');
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
        setErrorMessage(`failed to export csv: ${err.message}`);
        setTimeout(() => {
          setErrorMessage('');
        }, DURATION.ERROR_MESSAGE_TIME);
      }
    }
  };

  return { fetchExportData, errorMessage, isExpired };
};
