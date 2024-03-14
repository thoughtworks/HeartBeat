import {
  PIPELINE_TOOL_VERIFY_ERROR_CASE_TEXT_MAPPING,
  PIPELINE_TOOL_GET_INFO_ERROR_CASE_TEXT_MAPPING,
  PIPELINE_TOOL_GET_INFO_ERROR_MESSAGE,
  UNKNOWN_ERROR_TITLE,
} from '@src/constants/resources';
import { IPipelineVerifyRequestDTO, PipelineInfoRequestDTO } from '@src/clients/pipeline/dto/request';
import { IPipelineInfoResponseDTO } from '@src/clients/pipeline/dto/response';
import { IHeartBeatError } from '@src/errors/ErrorType';
import { HttpClient } from '@src/clients/HttpClient';
import { isHeartBeatException } from '@src/errors';
import { HttpStatusCode } from 'axios';

export interface IVerifyPipelineToolResult {
  code: number | string | undefined | null;
  errorTitle: string;
}

export interface IGetPipelineToolInfoResult {
  code: number | string | undefined | null;
  data?: IPipelineInfoResponseDTO;
  errorTitle: string;
  errorMessage: string;
}

export class PipelineToolClient extends HttpClient {
  verify = async (
    params: IPipelineVerifyRequestDTO,
    setIsShowAlert: (value: boolean) => void,
    setIsVerifyTimeOut: (value: boolean) => void,
  ): Promise<IVerifyPipelineToolResult> => {
    const result: IVerifyPipelineToolResult = {
      code: null,
      errorTitle: '',
    };
    try {
      const response = await this.axiosInstance.post(`/pipelines/${params.type.toLowerCase()}/verify`, params);
      result.code = response.status;
      setIsShowAlert(false);
      setIsVerifyTimeOut(false);
    } catch (e) {
      if (isHeartBeatException(e)) {
        const exception = e as IHeartBeatError;
        result.code = exception.code;
        result.errorTitle = PIPELINE_TOOL_VERIFY_ERROR_CASE_TEXT_MAPPING[`${exception.code}`] || UNKNOWN_ERROR_TITLE;
      }
    }

    return result;
  };

  getInfo = async (params: PipelineInfoRequestDTO): Promise<IGetPipelineToolInfoResult> => {
    const result: IGetPipelineToolInfoResult = {
      code: null,
      data: undefined,
      errorTitle: '',
      errorMessage: '',
    };

    try {
      const response = await this.axiosInstance.post(`/pipelines/${params.type.toLowerCase()}/info`, params);
      if (response.status === HttpStatusCode.Ok) {
        result.data = response.data as IPipelineInfoResponseDTO;
      } else if (response.status === HttpStatusCode.NoContent) {
        result.errorTitle = PIPELINE_TOOL_GET_INFO_ERROR_CASE_TEXT_MAPPING[response.status];
        result.errorMessage = PIPELINE_TOOL_GET_INFO_ERROR_MESSAGE;
      }
      result.code = response.status;
    } catch (e) {
      if (isHeartBeatException(e)) {
        const exception = e as IHeartBeatError;
        result.code = exception.code;
        result.errorTitle = PIPELINE_TOOL_GET_INFO_ERROR_CASE_TEXT_MAPPING[`${exception.code}`] || UNKNOWN_ERROR_TITLE;
      }

      result.errorMessage = PIPELINE_TOOL_GET_INFO_ERROR_MESSAGE;
    }

    return result;
  };
}

export const pipelineToolClient = new PipelineToolClient();
