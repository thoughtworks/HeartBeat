import { useState } from 'react';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { MESSAGE } from '@src/constants/resources';
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request';

export interface useVerifyPipeLineToolStateInterface {
  verifyPipelineTool: (params: PipelineRequestDTO) => Promise<
    | {
        isPipelineToolVerified: boolean;
      }
    | undefined
  >;
  isLoading: boolean;
  errorMessage: string;
  clearErrorMessage: () => void;
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
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrorMessage = () => {
    if (errorMessage) setErrorMessage('');
  };

  return {
    verifyPipelineTool,
    isLoading,
    errorMessage,
    clearErrorMessage,
  };
};
