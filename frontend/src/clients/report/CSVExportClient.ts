import { HttpClient } from '@src/clients/Httpclient'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import moment from 'moment'

export class CSVExportClient extends HttpClient {
  parseTimeStampToHumanDate = (csvTimeStamp: number | undefined): string =>
    moment(csvTimeStamp).format('YYYY-MM-DD-kk-mm-ss')

  fetchExportData = async (params: CSVReportRequestDTO) => {
    await this.axiosInstance
      .get(`/reports/csv`, { params, responseType: 'blob' })
      .then((res) => {
        const blob = new Blob([res.data])
        const exportedFilename = `pipeline-data-${this.parseTimeStampToHumanDate(params.csvTimeStamp)}.csv`
        // For other browsers
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

export const csvExportClient = new CSVExportClient()
