import { HttpClient } from '@src/clients/Httpclient'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import dayjs from 'dayjs'

export class CsvClient extends HttpClient {
  parseTimeStampToHumanDate = (csvTimeStamp: number | undefined): string =>
    dayjs(csvTimeStamp).format('YYYY-MM-DD-HH-mm-ss')

  fetchExportData = async (params: CSVReportRequestDTO) => {
    await this.axiosInstance
      .get(`/reports/csv/${params.dataType}-${params.csvTimeStamp}.csv`, { responseType: 'blob' })
      .then((res) => {
        const blob = new Blob([res.data])
        const exportedFilename = `pipeline-data-${this.parseTimeStampToHumanDate(params.csvTimeStamp)}.csv`
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', exportedFilename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch((e) => {
        throw e
      })
  }
}

export const csvClient = new CsvClient()
