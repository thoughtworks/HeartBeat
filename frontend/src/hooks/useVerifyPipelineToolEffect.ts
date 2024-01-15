import { useState } from 'react';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { IPipelineVerifyRequestDTO } from '@src/clients/pipeline/dto/request';
import { useAppDispatch } from '@src/hooks';
import { HttpStatusCode } from 'axios';
import { updatePipelineToolVerifyState } from '@src/context/config/configSlice';
import { initDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';

export interface IUseVerifyPipeLineToolStateInterface {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  verifyPipelineTool: (_params: IPipelineVerifyRequestDTO) => void;
  isLoading: boolean;
  errorMessage: string;
  clearErrorMessage: () => void;
}

export const useVerifyPipelineToolEffect = (): IUseVerifyPipeLineToolStateInterface => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch();

  const verifyPipelineTool = async (params: IPipelineVerifyRequestDTO) => {
    setIsLoading(true);
    const response = await pipelineToolClient.verifyPipelineTool(params);
    if (response.code === HttpStatusCode.NoContent) {
      dispatch(updatePipelineToolVerifyState(true));
      dispatch(initDeploymentFrequencySettings());
    } else {
      setErrorMessage(response.errorTitle);
    }
    setIsLoading(false);
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
