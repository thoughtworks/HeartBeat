import { SourceControlInfoRequestDTO, SourceControlVerifyRequestDTO } from '@src/clients/sourceControl/dto/request';
import { SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT_MAPPING, UNKNOWN_ERROR_TITLE } from '@src/constants/resources';
import { IHeartBeatError } from '@src/errors/ErrorType';
import { HttpClient } from '@src/clients/HttpClient';
import { isHeartBeatException } from '@src/errors';

export interface SourceControlResult {
  code?: number | string;
  errorTitle?: string;
}

export class SourceControlClient extends HttpClient {
  verifyToken = async (
    params: SourceControlVerifyRequestDTO,
    setIsShowAlert: (value: boolean) => void,
    setIsVerifyTimeOut: (value: boolean) => void,
  ) => {
    const result: SourceControlResult = {};
    const { token, type } = params;
    try {
      const response = await this.axiosInstance.post(`/source-control/${type.toLocaleLowerCase()}/verify`, {
        token,
      });
      result.code = response.status;
      setIsShowAlert(false);
      setIsVerifyTimeOut(false);
    } catch (e) {
      if (isHeartBeatException(e)) {
        const exception = e as IHeartBeatError;
        result.code = exception.code;
        result.errorTitle = SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT_MAPPING[`${exception.code}`] || UNKNOWN_ERROR_TITLE;
      }
    }
    return result;
  };

  verifyBranch = async (params: SourceControlInfoRequestDTO) => {
    const result: SourceControlResult = {};
    const { token, type, repository, branch } = params;
    try {
      const response = await this.axiosInstance.post(
        `/source-control/${type.toLocaleLowerCase()}/repos/branches/verify`,
        {
          token,
          repository,
          branch,
        },
      );
      result.code = response.status;
    } catch (e) {
      if (isHeartBeatException(e)) {
        const exception = e as IHeartBeatError;
        result.code = exception.code;
        result.errorTitle = SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT_MAPPING[`${exception.code}`] || UNKNOWN_ERROR_TITLE;
      }
    }
    return result;
  };
}

export const sourceControlClient = new SourceControlClient();
