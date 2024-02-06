import { BoardInfoRequestDTO } from '@src/clients/board/dto/request';
import { getJiraBoardToken } from '@src/utils/util';
import { HttpClient } from '../HttpClient';
export class BoardInfoClient extends HttpClient {
  getBoardInfo = async (params: BoardInfoRequestDTO) => {
    return this.axiosInstance.post(`/boards/${params.type.toLowerCase()}/info`, {
      ...params,
      token: getJiraBoardToken(params.token, params.email),
    });
  };
}

export const boardInfoClient = new BoardInfoClient();
