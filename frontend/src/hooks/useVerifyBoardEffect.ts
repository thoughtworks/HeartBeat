import { BOARD_TYPES, AXIOS_REQUEST_ERROR_CODE, MESSAGE, UNKNOWN_ERROR_TITLE } from '@src/constants/resources';
import { selectBoard, updateBoard, updateBoardVerifyState } from '@src/context/config/configSlice';
import { findCaseInsensitiveType, getJiraBoardToken } from '@src/utils/util';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { DEFAULT_HELPER_TEXT, EMPTY_STRING } from '@src/constants/commons';
import { BoardRequestDTO } from '@src/clients/board/dto/request';
import { boardClient } from '@src/clients/board/BoardClient';
import { IAppError } from '@src/errors/ErrorType';
import { REGEX } from '@src/constants/regex';
import { isAppError } from '@src/errors';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';

export interface Field {
  key: string;
  value: string;
  validateRule?: (value: string) => boolean;
  validatedError: string;
  verifiedError: string;
  col: number;
}

export interface useVerifyBoardStateInterface {
  isVerifyTimeOut: boolean;
  verifyJira: () => Promise<void>;
  isLoading: boolean;
  fields: Field[];
  updateField: (key: string, value: string) => void;
  validateField: (key: string) => void;
  resetFields: () => void;
  setIsShowAlert: (value: boolean) => void;
  isShowAlert: boolean;
}

const ERROR_INFO = {
  SITE_NOT_FOUND: 'site is incorrect',
  BOARD_NOT_FOUND: 'boardId is incorrect',
};

const VALIDATOR = {
  EMAIL: (value: string) => REGEX.EMAIL.test(value),
  TOKEN: (value: string) => REGEX.BOARD_TOKEN.test(value),
  BOARD_ID: (value: string) => REGEX.BOARD_ID.test(value),
};

export const KEYS = {
  BOARD: 'Board',
  BOARD_ID: 'Board Id',
  EMAIL: 'Email',
  SITE: 'Site',
  TOKEN: 'Token',
};

const getValidatedError = (key: string, value: string, validateRule?: (value: string) => boolean) => {
  if (!value) {
    return `${key} is required!`;
  }
  if (validateRule && !validateRule(value)) {
    return `${key} is invalid!`;
  }
  return DEFAULT_HELPER_TEXT;
};

export const useVerifyBoardEffect = (): useVerifyBoardStateInterface => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyTimeOut, setIsVerifyTimeOut] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const boardFields = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();
  const type = findCaseInsensitiveType(Object.values(BOARD_TYPES), boardFields.type);
  const [fields, setFields] = useState<Field[]>([
    {
      key: KEYS.BOARD,
      value: type,
      validatedError: '',
      verifiedError: '',
      col: 1,
    },
    {
      key: KEYS.BOARD_ID,
      value: boardFields.boardId,
      validateRule: VALIDATOR.BOARD_ID,
      validatedError: boardFields.boardId
        ? getValidatedError(KEYS.BOARD_ID, boardFields.boardId, VALIDATOR.BOARD_ID)
        : '',
      verifiedError: '',
      col: 1,
    },
    {
      key: KEYS.EMAIL,
      value: boardFields.email,
      validateRule: VALIDATOR.EMAIL,
      validatedError: boardFields.email ? getValidatedError(KEYS.EMAIL, boardFields.email, VALIDATOR.EMAIL) : '',
      verifiedError: '',
      col: 1,
    },
    {
      key: KEYS.SITE,
      value: boardFields.site,
      validatedError: '',
      verifiedError: '',
      col: 1,
    },
    {
      key: KEYS.TOKEN,
      value: boardFields.token,
      validateRule: VALIDATOR.TOKEN,
      validatedError: boardFields.token ? getValidatedError(KEYS.TOKEN, boardFields.token, VALIDATOR.TOKEN) : '',
      verifiedError: '',
      col: 2,
    },
  ]);

  const getBoardInfo = (fields: Field[]) => {
    const keys = ['type', 'boardId', 'email', 'site', 'token'];
    return keys.reduce((board, key, index) => ({ ...board, [key]: fields[index].value }), {});
  };

  const handleUpdate = (fields: Field[]) => {
    setFields(fields);
    dispatch(updateBoardVerifyState(false));
    dispatch(updateBoard(getBoardInfo(fields)));
  };

  const resetFields = () => {
    const newFields = fields.map((field) =>
      field.key === KEYS.BOARD
        ? field
        : {
            ...field,
            value: EMPTY_STRING,
            validatedError: '',
            verifiedError: '',
          },
    );
    handleUpdate(newFields);
    setIsShowAlert(false);
  };

  const getFieldsWithNoVerifiedError = (fields: Field[]) =>
    fields.map((field) => ({
      ...field,
      verifiedError: '',
    }));

  const updateField = (key: string, value: string) => {
    const shouldClearVerifiedError = !!fields.find((field) => field.key === key)?.verifiedError;
    const fieldsWithError = shouldClearVerifiedError ? getFieldsWithNoVerifiedError(fields) : fields;
    const newFields = fieldsWithError.map((field) =>
      field.key === key
        ? {
            ...field,
            value: value.trim(),
            validatedError: getValidatedError(field.key, value.trim(), field.validateRule),
          }
        : field,
    );
    handleUpdate(newFields);
  };

  const validateField = (key: string) => {
    const newFields = fields.map((field) =>
      field.key === key
        ? {
            ...field,
            validatedError: getValidatedError(field.key, field.value, field.validateRule),
          }
        : field,
    );
    setFields(newFields);
  };

  const setVerifiedError = (keys: string[], messages: string[]) => {
    setFields(
      fields.map((field) => {
        return keys.includes(field.key)
          ? {
              ...field,
              validatedError: '',
              verifiedError: messages[keys.findIndex((key) => key === field.key)],
            }
          : field;
      }),
    );
  };

  const verifyJira = async () => {
    setIsLoading(true);
    const boardInfo = getBoardInfo(fields) as BoardRequestDTO;
    try {
      const res: { response: Record<string, string> } = await boardClient.getVerifyBoard({
        ...boardInfo,
        token: getJiraBoardToken(boardInfo.token, boardInfo.email),
      });
      if (res?.response) {
        setIsShowAlert(false);
        setIsVerifyTimeOut(false);
        dispatch(updateBoardVerifyState(true));
        dispatch(updateBoard({ ...boardInfo, projectKey: res.response.projectKey }));
      }
    } catch (e) {
      if (isAppError(e)) {
        const { description, code } = e as IAppError;
        setIsVerifyTimeOut(false);
        setIsShowAlert(false);
        if (code === HttpStatusCode.Unauthorized) {
          setVerifiedError(
            [KEYS.EMAIL, KEYS.TOKEN],
            [MESSAGE.VERIFY_MAIL_FAILED_ERROR, MESSAGE.VERIFY_TOKEN_FAILED_ERROR],
          );
        } else if (code === HttpStatusCode.NotFound && description === ERROR_INFO.SITE_NOT_FOUND) {
          setVerifiedError([KEYS.SITE], [MESSAGE.VERIFY_SITE_FAILED_ERROR]);
        } else if (code === HttpStatusCode.NotFound && description === ERROR_INFO.BOARD_NOT_FOUND) {
          setVerifiedError([KEYS.BOARD_ID], [MESSAGE.VERIFY_BOARD_FAILED_ERROR]);
        } else if (code === AXIOS_REQUEST_ERROR_CODE.TIMEOUT) {
          setIsVerifyTimeOut(true);
          setIsShowAlert(true);
        } else {
          setVerifiedError([KEYS.TOKEN], [UNKNOWN_ERROR_TITLE]);
        }
      }
    }
    setIsLoading(false);
  };

  return {
    verifyJira,
    isLoading,
    fields,
    updateField,
    validateField,
    resetFields,
    isVerifyTimeOut,
    isShowAlert,
    setIsShowAlert,
  };
};
