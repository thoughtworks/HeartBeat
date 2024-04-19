import { CSVReportRequestDTO } from '@src/clients/report/dto/request';
import { HttpClient } from '@src/clients/HttpClient';
import { downloadCSV } from '@src/utils/util';
import dayjs from 'dayjs';

export class CSVClient extends HttpClient {
  parseTimeStampToHumanDate = (csvTimeStamp: number | undefined): string => dayjs(csvTimeStamp).format('HHmmSSS');
  parseCollectionDateToHumanDate = (date: string) => dayjs(date).format('YYYYMMDD');

  exportCSVData = async (params: CSVReportRequestDTO) => {
    await this.axiosInstance
      .get(`/reports/${params.dataType}/${params.csvTimeStamp}`, {
        params: {
          startTime: this.parseCollectionDateToHumanDate(params.startDate),
          endTime: this.parseCollectionDateToHumanDate(params.endDate),
        },
        responseType: 'blob',
      })
      .then((res) => {
        const exportedFilename = `${params.dataType}-${this.parseCollectionDateToHumanDate(
          params.startDate,
        )}-${this.parseCollectionDateToHumanDate(params.endDate)}-${this.parseTimeStampToHumanDate(
          params.csvTimeStamp,
        )}.csv`;
        downloadCSV(exportedFilename, res.data);
      })
      .catch((e) => {
        throw e;
      });
  };
}

export const csvClient = new CSVClient();
