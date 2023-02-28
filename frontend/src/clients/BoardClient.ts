import { HttpClient } from '@src/clients/Httpclient'

export class BoardClient extends HttpClient {
  isBoardVerify = false
  isNoDoneCard = false
  isShowErrorNotification = false
  response = {}

  getVerifyBoard = async () => {
    try {
      const result = await this.axiosInstance.get('/kanban/verify').then((res) => res)
      result.status === 204 ? this.handleBoardNoDoneCard() : this.handleBoardVerifySucceed(result.data)
    } catch (e) {
      this.handleBoardVerifyFailed()
    }
    return {
      response: this.response,
      isBoardVerify: this.isBoardVerify,
      isNoDoneCard: this.isNoDoneCard,
      isShowErrorNotification: this.isShowErrorNotification,
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

  handleBoardVerifyFailed = () => {
    this.isBoardVerify = false
    this.isShowErrorNotification = true
  }
}

export const boardClient = new BoardClient()
