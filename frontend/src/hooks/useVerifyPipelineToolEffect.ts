import { useState } from 'react';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { MESSAGE } from '@src/constants/resources';
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request';
import { DURATION } from '@src/constants/commons';

export interface useVerifyPipeLineToolStateInterface {
  verifyPipelineTool: (params: PipelineRequestDTO) => Promise<
    | {
        isPipelineToolVerified: boolean;
        response: object;
      }
    | undefined
  >;
  isLoading: boolean;
  errorMessage: string;
}

export const useVerifyPipelineToolEffect = (): useVerifyPipeLineToolStateInterface => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const verifyPipelineTool = async (params: PipelineRequestDTO) => {
    setIsLoading(true);
    try {
      return await pipelineToolClient.verifyPipelineTool(params);
    } catch (e) {
      const err = e as Error;
      setErrorMessage(`${params.type} ${MESSAGE.VERIFY_FAILED_ERROR}: ${err.message}`);
      setTimeout(() => {
        setErrorMessage('');
      }, DURATION.ERROR_MESSAGE_TIME);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyPipelineTool,
    isLoading,
    errorMessage,
  };
};
