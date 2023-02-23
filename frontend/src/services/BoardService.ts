import { boardClient } from '@src/clients/BoardClient'

export class BoardService {
  getVerifyBoard = async () => {
    try {
      return await boardClient.get('/jira/board')
    } catch (e) {
      //TODO: handle error
    }
  }
}

export const boardService = new BoardService()
