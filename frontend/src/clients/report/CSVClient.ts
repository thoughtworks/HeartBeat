import { HttpClient } from '@src/clients/Httpclient'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import dayjs from 'dayjs'
import { downloadCSV } from '@src/utils/util'

export class CSVClient extends HttpClient {
  parseTimeStampToHumanDate = (csvTimeStamp: number | undefined): string =>
    dayjs(csvTimeStamp).format('YYYY-MM-DD-HH-mm-ss')

  exportCSVData = async (params: CSVReportRequestDTO) => {
    const response = await this.axiosInstance.get(`/reports/${params.dataType}/${params.csvTimeStamp}`, {
      responseType: 'blob',
    })
    const exportedFilename = `${params.dataType}-data-${this.parseTimeStampToHumanDate(params.csvTimeStamp)}.csv`
    downloadCSV(exportedFilename, response.data)
  }
}

export const csvClient = new CSVClient()
