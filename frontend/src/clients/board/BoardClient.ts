import { BoardRequestDTO } from '@src/clients/board/dto/request';
import { HttpClient } from '@src/clients/HttpClient';
import { HttpStatusCode } from 'axios';

export class BoardClient extends HttpClient {
  isBoardVerify = false;
  haveDoneCard = true;
  response = {};

  getVerifyBoard = async (params: BoardRequestDTO) => {
    this.isBoardVerify = false;
    this.haveDoneCard = true;
    this.response = {};
    try {
      const boardType = params.type === 'Classic Jira' ? 'classic-jira' : params.type.toLowerCase();
      const result = await this.axiosInstance.post(`/boards/${boardType}`, params);
      result.status === HttpStatusCode.NoContent
        ? this.handleBoardNoDoneCard()
        : this.handleBoardVerifySucceed(result.data);
    } catch (e) {
      this.isBoardVerify = false;
      throw e;
    }
    return {
      response: this.response,
      isBoardVerify: this.isBoardVerify,
      haveDoneCard: this.haveDoneCard,
    };
  };

  handleBoardNoDoneCard = () => {
    this.isBoardVerify = false;
    this.haveDoneCard = false;
  };

  handleBoardVerifySucceed = (res: object) => {
    this.isBoardVerify = true;
    this.response = res;
  };
}

export const boardClient = new BoardClient();
