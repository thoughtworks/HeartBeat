import { HttpClient } from '@src/clients/Httpclient'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import dayjs from 'dayjs'
import { downloadCSV } from '@src/utils/util'

export class CSVClient extends HttpClient {
  parseTimeStampToHumanDate = (csvTimeStamp: number | undefined): string => dayjs(csvTimeStamp).format('SSS')
  parseCollectionDateToHumanDate = (date: string) => dayjs(date).format('YYYYMMDD')

  exportCSVData = async (params: CSVReportRequestDTO) => {
    await this.axiosInstance
      .get(`/reports/${params.dataType}/${params.csvTimeStamp}`, { responseType: 'blob' })
      .then((res) => {
        const exportedFilename = `${params.dataType}-${this.parseCollectionDateToHumanDate(
          params.startDate
        )}-to-${this.parseCollectionDateToHumanDate(params.endDate)}-${this.parseTimeStampToHumanDate(
          params.csvTimeStamp
        )}.csv`
        downloadCSV(exportedFilename, res.data)
      })
      .catch((e) => {
        throw e
      })
  }
}

export const csvClient = new CSVClient()
