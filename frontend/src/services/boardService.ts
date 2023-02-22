import { boardClient } from '@src/clients/BoardClient'

export class BoardService {
  getVerifyBoard = async () => await boardClient.get('/jira/board')
}

export const boardService = new BoardService()
