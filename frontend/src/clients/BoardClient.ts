import { HttpClient } from '@src/clients/Httpclient'
import { HttpStatusCode } from 'axios'
import { VerifyBoardReq } from '@src/models/request/boardReq'

export class BoardClient extends HttpClient {
  isBoardVerify = false
  isNoDoneCard = false
  response = {}

  getVerifyBoard = async (params: VerifyBoardReq) => {
    try {
      const boardType = params.type === 'Classic Jira' ? 'classic-jira' : params.type.toLowerCase()
      const result = await this.axiosInstance.get(`/boards/${boardType}`, { params })
      result.status === HttpStatusCode.NoContent
        ? this.handleBoardNoDoneCard()
        : this.handleBoardVerifySucceed(result.data)
    } catch (e) {
      this.isBoardVerify = false
      throw e
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
