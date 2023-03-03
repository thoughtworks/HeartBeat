import { HttpClient } from '@src/clients/Httpclient'
import { BadRequestException } from '../exceptions/BadRequestException'
import { BadServerException } from '@src/exceptions/BasServerException'
import { AxiosError } from 'axios'

export interface getVerifyBoardParams {
  token: string
  type: string
  site: string
  projectKey: string
  startTime: string | null
  endTime: string | null
  boardId: string
}
export class BoardClient extends HttpClient {
  isBoardVerify = false
  isNoDoneCard = false
  response = {}

  getVerifyBoard = async (params: getVerifyBoardParams) => {
    try {
      const result = await this.axiosInstance.get('/kanban/verify', { params: { ...params } }).then((res) => res)
      result.status === 204 ? this.handleBoardNoDoneCard() : this.handleBoardVerifySucceed(result.data)
    } catch (e) {
      this.isBoardVerify = false
      const code = (e as AxiosError).response?.status
      if (code === 404) {
        throw new BadRequestException(params.type, 'verify failed')
      }
      if (code === 500) {
        throw new BadServerException(params.type, 'verify failed')
      }
    }
    return {
      response: this.response,
      isBoardVerify: this.isBoardVerify,
      isNoDoneCard: this.isNoDoneCard,
    }
  }

  handleBoardNoDoneCard = () => {
    this.isBoardVerify = false
    this.isNoDoneCard = true
  }

  handleBoardVerifySucceed = (res: object) => {
    this.isBoardVerify = true
    this.response = res
  }
}

export const boardClient = new BoardClient()
