import { HttpClient } from '@src/clients/Httpclient'
import { BadRequestException } from '../exceptions/BadRequestException'
import { BadServerException } from '@src/exceptions/BasServerException'
import { AxiosError } from 'axios'

export class BoardClient extends HttpClient {
  isBoardVerify = false
  isNoDoneCard = false
  response = {}

  getVerifyBoard = async () => {
    try {
      const result = await this.axiosInstance.get('/kanban/verify').then((res) => res)
      result.status === 204 ? this.handleBoardNoDoneCard() : this.handleBoardVerifySucceed(result.data)
    } catch (e) {
      this.isBoardVerify = false
      const err = e as AxiosError
      if (err.status === 400) {
        throw new BadRequestException('jira', 'bad request')
      }
      if (err.status === 500) {
        throw new BadServerException('jira', 'bad server')
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
