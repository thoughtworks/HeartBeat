import { HttpClient } from '@src/clients/HttpClient.base';
import { HttpStatusCode } from 'axios';
import { isHeartBeatException } from '@src/exceptions';
import { IHeartBeatException } from '@src/exceptions/ExceptionType';
import { IPipelineVerifyRequestDTO, PipelineInfoRequestDTO } from '@src/clients/pipeline/dto/request';
import { IPipelineInfoResponseDTO } from '@src/clients/pipeline/dto/response';
import {
  PIPELINE_TOOL_VERIFY_ERROR_CASE_TEXT_MAPPING,
  PIPELINE_TOOL_GET_INFO_ERROR_CASE_TEXT_MAPPING,
  PIPELINE_TOOL_GET_INFO_ERROR_MESSAGE,
  UNKNOWN_ERROR_TITLE,
} from '@src/constants/resources';

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
  verify = async (params: IPipelineVerifyRequestDTO): Promise<IVerifyPipelineToolResult> => {
    const result: IVerifyPipelineToolResult = {
      code: null,
      errorTitle: '',
    };
    try {
      const response = await this.axiosInstance.post(`/pipelines/${params.type.toLowerCase()}/verify`, params);
      result.code = response.status;
    } catch (e) {
      if (isHeartBeatException(e)) {
        const exception = e as IHeartBeatException;
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
        const exception = e as IHeartBeatException;
        result.code = exception.code;
        result.errorTitle = PIPELINE_TOOL_GET_INFO_ERROR_CASE_TEXT_MAPPING[`${exception.code}`] || UNKNOWN_ERROR_TITLE;
      }

      result.errorMessage = PIPELINE_TOOL_GET_INFO_ERROR_MESSAGE;
    }

    return result;
  };
}

export const pipelineToolClient = new PipelineToolClient();
