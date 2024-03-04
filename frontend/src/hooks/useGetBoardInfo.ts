import { BOARD_CONFIG_INFO_ERROR, BOARD_CONFIG_INFO_TITLE } from '@src/constants/resources';
import { boardInfoClient } from '@src/clients/board/BoardInfoClient';
import { BoardInfoRequestDTO } from '@src/clients/board/dto/request';
import { HEARTBEAT_EXCEPTION_CODE } from '@src/constants/resources';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { ReactNode, useState } from 'react';
import get from 'lodash/get';

export type JiraColumns = Record<string, string>[];
export type TargetFields = Record<string, string>[];
export type Users = string[];
export interface BoardInfoResponse {
  jiraColumns: JiraColumns;
  targetFields: TargetFields;
  users: Users;
}
export interface useGetBoardInfoInterface {
  getBoardInfo: (data: BoardInfoRequestDTO) => Promise<AxiosResponse<BoardInfoResponse>>;
  isLoading: boolean;
  errorMessage: Record<string, ReactNode>;
}

const codeMapping = (code: string | number) => {
  const codes = {
    [HttpStatusCode.BadRequest]: {
      title: BOARD_CONFIG_INFO_TITLE.INVALID_INPUT,
      message: BOARD_CONFIG_INFO_ERROR.NOT_FOUND,
      code: HttpStatusCode.BadRequest,
    },
    [HttpStatusCode.Unauthorized]: {
      title: BOARD_CONFIG_INFO_TITLE.UNAUTHORIZED_REQUEST,
      message: BOARD_CONFIG_INFO_ERROR.NOT_FOUND,
      code: HttpStatusCode.Unauthorized,
    },
    [HttpStatusCode.Forbidden]: {
      title: BOARD_CONFIG_INFO_TITLE.FORBIDDEN_REQUEST,
      message: BOARD_CONFIG_INFO_ERROR.FORBIDDEN,
      code: HttpStatusCode.Forbidden,
    },
    [HttpStatusCode.NotFound]: {
      title: BOARD_CONFIG_INFO_TITLE.NOT_FOUND,
      message: BOARD_CONFIG_INFO_ERROR.NOT_FOUND,
      code: HttpStatusCode.NotFound,
    },
    [HEARTBEAT_EXCEPTION_CODE.TIMEOUT]: {
      title: BOARD_CONFIG_INFO_TITLE.EMPTY,
      message: BOARD_CONFIG_INFO_ERROR.RETRY,
      code: HEARTBEAT_EXCEPTION_CODE.TIMEOUT,
    },
  };
  return get(codes, code);
};

export const useGetBoardInfoEffect = (): useGetBoardInfoInterface => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const getBoardInfo = (data: BoardInfoRequestDTO) => {
    setIsLoading(true);
    setErrorMessage({});
    return boardInfoClient
      .getBoardInfo(data)
      .then((res) => {
        if (!res.data) {
          setErrorMessage({
            title: BOARD_CONFIG_INFO_TITLE.NO_CONTENT,
            message: BOARD_CONFIG_INFO_ERROR.NOT_CONTENT,
            code: HttpStatusCode.NoContent,
          });
        }
        return res;
      })
      .catch((err) => {
        const { code } = err;
        setErrorMessage(codeMapping(code));
        return err;
      })
      .finally(() => setIsLoading(false));
  };
  return {
    getBoardInfo,
    errorMessage,
    isLoading,
  };
};
