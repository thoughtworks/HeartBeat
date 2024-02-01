import { DEFAULT_HELPER_TEXT, EMPTY_STRING } from '@src/constants/commons';
import { BoardRequestDTO } from '@src/clients/board/dto/request';
import { selectBoard } from '@src/context/config/configSlice';
import { boardClient } from '@src/clients/board/BoardClient';
import { useAppSelector } from '@src/hooks/useAppDispatch';
import { findCaseInsensitiveType } from '@src/utils/util';
import { BOARD_TYPES } from '@src/constants/resources';
import { getJiraBoardToken } from '@src/utils/util';
import { MESSAGE } from '@src/constants/resources';
import { REGEX } from '@src/constants/regex';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';

export interface FormField {
  key: string;
  name: string;
  value: string;
  defaultValue: string;
  isRequired: boolean;
  isValid: boolean;
  validRule?: (value: string) => boolean;
  errorMessage: string;
  col: number;
}
export interface useVerifyBoardStateInterface {
  verifyJira: (params: BoardRequestDTO) => Promise<{
    response: Record<string, string>;
  }>;
  isLoading: boolean;
  formFields: FormField[];
  updateField: (name: string, value: string) => void;
  resetFormFields: () => void;
  clearError: () => void;
}

const ERROR_INFO = {
  SITE_NOT_FOUND: 'site is incorrect',
  BOARD_NOT_FOUND: 'boardId is incorrect',
};

export const useVerifyBoardEffect = (): useVerifyBoardStateInterface => {
  const [isLoading, setIsLoading] = useState(false);
  const boardFields = useAppSelector(selectBoard);
  const type = findCaseInsensitiveType(Object.values(BOARD_TYPES), boardFields.type);
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      key: 'Board',
      name: 'boardType',
      value: type,
      defaultValue: BOARD_TYPES.JIRA,
      isRequired: true,
      isValid: true,
      errorMessage: '',
      col: 1,
    },
    {
      key: 'Board Id',
      name: 'boardId',
      value: boardFields.boardId,
      defaultValue: EMPTY_STRING,
      isRequired: true,
      isValid: true,
      errorMessage: '',
      col: 1,
    },
    {
      key: 'Email',
      name: 'email',
      value: boardFields.email,
      defaultValue: EMPTY_STRING,
      isRequired: true,
      isValid: true,
      validRule: (value: string) => REGEX.EMAIL.test(value),
      errorMessage: '',
      col: 1,
    },
    {
      key: 'Site',
      name: 'site',
      value: boardFields.site,
      defaultValue: EMPTY_STRING,
      isRequired: true,
      isValid: true,
      errorMessage: '',
      col: 1,
    },
    {
      key: 'Token',
      name: 'token',
      value: boardFields.token,
      defaultValue: EMPTY_STRING,
      isRequired: true,
      isValid: true,
      validRule: (value: string) => REGEX.BOARD_TOKEN.test(value),
      errorMessage: '',
      col: 2,
    },
  ]);

  const resetFormFields = () =>
    setFormFields(
      formFields.map((field) => {
        return { ...field, value: EMPTY_STRING, isRequired: true, isValid: true };
      }),
    );

  const clearError = () => {
    return setFormFields(formFields.map(clearErrorField));
  };

  const setErrorField = (names: string[], messages: string[]) => {
    setFormFields(
      formFields.map((field) => {
        return names.includes(field.name)
          ? { ...field, isValid: false, errorMessage: messages[names.findIndex((name) => name === field.name)] }
          : field;
      }),
    );
  };

  const clearErrorField = (field: FormField) => {
    return {
      ...field,
      isValid: true,
      isRequired: true,
      errorMessage: '',
    };
  };

  const validField = (field: FormField, inputValue: string) => {
    const value = inputValue.trim();
    const isRequired = !!value;
    const isValid = !field.validRule || field.validRule(value);
    const errorMessage = !isRequired
      ? `${field.key} is required!`
      : !isValid
        ? `${field.key} is invalid!`
        : DEFAULT_HELPER_TEXT;

    return {
      ...field,
      value,
      isRequired,
      isValid,
      errorMessage,
    };
  };

  const updateField = (name: string, value: string) => {
    setFormFields(
      formFields.map((field) => {
        return field.name === name ? validField(field, value) : clearErrorField(field);
      }),
    );
  };

  const verifyJira = (params: BoardRequestDTO) => {
    setIsLoading(true);
    return boardClient
      .getVerifyBoard({
        ...params,
        token: getJiraBoardToken(params.token, params.email),
      })
      .then((result) => {
        clearError();
        return result;
      })
      .catch((e) => {
        const { description, code } = e;
        if (code === HttpStatusCode.Unauthorized) {
          setErrorField(['email', 'token'], [MESSAGE.VERIFY_MAIL_FAILED_ERROR, MESSAGE.VERIFY_TOKEN_FAILED_ERROR]);
        }
        if (code === HttpStatusCode.NotFound && description === ERROR_INFO.SITE_NOT_FOUND) {
          setErrorField(['site'], [MESSAGE.VERIFY_SITE_FAILED_ERROR]);
        }
        if (code === HttpStatusCode.NotFound && description === ERROR_INFO.BOARD_NOT_FOUND) {
          setErrorField(['boardId'], [MESSAGE.VERIFY_BOARD_FAILED_ERROR]);
        }
        return e;
      })
      .finally(() => setIsLoading(false));
  };

  return {
    verifyJira,
    isLoading,
    formFields,
    updateField,
    clearError,
    resetFormFields,
  };
};
