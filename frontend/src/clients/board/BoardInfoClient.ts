import { BoardInfoRequestDTO } from '@src/clients/board/dto/request';
import { HttpClient } from '../HttpClient';

export class BoardInfoClient extends HttpClient {
  getBoardInfo = async (params: BoardInfoRequestDTO) => {
    return this.axiosInstance.post(`/boards/${params.type.toLowerCase()}/info`, params);
  };
}

export const boardInfoClient = new BoardInfoClient();
