import { HttpClient } from '@src/clients/Httpclient'
import { BadRequestException } from '../exceptions/BadRequestException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { AxiosError, HttpStatusCode } from 'axios'
import { NotFoundException } from '@src/exceptions/NotFoundException'

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
      const boardType = params.type === 'Classic Jira' ? 'classic-jira' : params.type.toLowerCase()
      const result = await this.axiosInstance.get(`/boards/${boardType}`, { params }).then((res) => res)
      result.status === HttpStatusCode.NoContent
        ? this.handleBoardNoDoneCard()
        : this.handleBoardVerifySucceed(result.data)
    } catch (e) {
      this.isBoardVerify = false
      const code = (e as AxiosError).response?.status
      if (code === HttpStatusCode.BadRequest) {
        throw new BadRequestException(params.type, 'Please reconfirm the input')
      }
      if (code === HttpStatusCode.Unauthorized) {
        throw new NotFoundException(params.type, 'Token is incorrect')
      }
      if (code === HttpStatusCode.InternalServerError) {
        throw new InternalServerException(params.type, 'Internal server error')
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
