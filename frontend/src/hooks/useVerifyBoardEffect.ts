import { AXIOS_REQUEST_ERROR_CODE, UNKNOWN_ERROR_TITLE } from '@src/constants/resources';
import { BOARD_CONFIG_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { useDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { updateTreatFlagCardAsBlock } from '@src/context/Metrics/metricsSlice';
import { updateShouldGetBoardConfig } from '@src/context/Metrics/metricsSlice';
import { IBoardConfigData } from '@src/containers/ConfigStep/Form/schema';
import { TBoardFieldKeys } from '@src/containers/ConfigStep/Form/type';
import { BoardRequestDTO } from '@src/clients/board/dto/request';
import { updateBoard } from '@src/context/config/configSlice';
import { boardClient } from '@src/clients/board/BoardClient';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { getJiraBoardToken } from '@src/utils/util';
import { IAppError } from '@src/errors/ErrorType';
import { useFormContext } from 'react-hook-form';
import { isAppError } from '@src/errors';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';

export enum FIELD_KEY {
  TYPE = 0,
  BOARD_ID = 1,
  EMAIL = 2,
  SITE = 3,
  TOKEN = 4,
}

export interface IField {
  key: TBoardFieldKeys;
  col: number;
  label: string;
}

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<void>;
  isLoading: boolean;
  fields: IField[];
  resetFields: () => void;
}

const ERROR_INFO = {
  SITE_NOT_FOUND: 'site is incorrect',
  BOARD_NOT_FOUND: 'boardId is incorrect',
};

export const KEYS: { [key: string]: TBoardFieldKeys } = {
  BOARD: 'type',
  BOARD_ID: 'boardId',
  EMAIL: 'email',
  SITE: 'site',
  TOKEN: 'token',
};

export const useVerifyBoardEffect = (): useVerifyBoardStateInterface => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { boardConfigOriginal } = useDefaultValues();
  const { reset, setError, getValues } = useFormContext();

  const originalFields: IField[] = [
    {
      key: KEYS.BOARD,
      col: 1,
      label: 'Board',
    },
    {
      key: KEYS.BOARD_ID,
      col: 1,
      label: 'Board Id',
    },
    {
      key: KEYS.EMAIL,
      col: 1,
      label: 'Email',
    },
    {
      key: KEYS.SITE,
      col: 1,
      label: 'Site',
    },
    {
      key: KEYS.TOKEN,
      col: 2,
      label: 'Token',
    },
  ];

  const persistReduxData = (shouldGetBoardConfig: boolean, boardInfo: IBoardConfigData & { projectKey?: string }) => {
    dispatch(updateShouldGetBoardConfig(shouldGetBoardConfig));
    dispatch(updateBoard(boardInfo));
  };

  const resetFields = () => {
    reset(boardConfigOriginal);
    persistReduxData(false, boardConfigOriginal);
  };

  const verifyJira = async () => {
    setIsLoading(true);
    dispatch(updateTreatFlagCardAsBlock(true));
    const boardInfo = getValues() as BoardRequestDTO;
    try {
      const res: { response: Record<string, string> } = await boardClient.getVerifyBoard({
        ...boardInfo,
        token: getJiraBoardToken(boardInfo.token, boardInfo.email),
      });
      if (res?.response) {
        persistReduxData(true, { ...boardInfo, projectKey: res.response.projectKey });
        reset(boardConfigOriginal, { keepValues: true });
      }
    } catch (e) {
      if (isAppError(e)) {
        const { description, code } = e as IAppError;
        if (code === HttpStatusCode.Unauthorized) {
          setError(KEYS.EMAIL, { message: BOARD_CONFIG_ERROR_MESSAGE.email.verifyFailed });
          setError(KEYS.TOKEN, { message: BOARD_CONFIG_ERROR_MESSAGE.token.verifyFailed });
        } else if (code === HttpStatusCode.NotFound && description === ERROR_INFO.SITE_NOT_FOUND) {
          setError(KEYS.SITE, { message: BOARD_CONFIG_ERROR_MESSAGE.site.verifyFailed });
        } else if (code === HttpStatusCode.NotFound && description === ERROR_INFO.BOARD_NOT_FOUND) {
          setError(KEYS.BOARD_ID, { message: BOARD_CONFIG_ERROR_MESSAGE.boardId.verifyFailed });
        } else if (code === AXIOS_REQUEST_ERROR_CODE.TIMEOUT) {
          setError(KEYS.TOKEN, { message: BOARD_CONFIG_ERROR_MESSAGE.token.timeout });
        } else {
          setError(KEYS.TOKEN, { message: UNKNOWN_ERROR_TITLE });
        }
      }
    }
    setIsLoading(false);
  };

  return {
    verifyJira,
    isLoading,
    fields: originalFields,
    resetFields,
  };
};
