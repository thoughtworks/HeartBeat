import { useState } from 'react';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { IPipelineVerifyRequestDTO } from '@src/clients/pipeline/dto/request';
import { useAppDispatch } from '@src/hooks';
import { HttpStatusCode } from 'axios';
import { updatePipelineToolVerifyState } from '@src/context/config/configSlice';
import { initDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';

export const useVerifyPipelineToolEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch();

  const verifyPipelineTool = async (params: IPipelineVerifyRequestDTO): Promise<void> => {
    setIsLoading(true);
    const response = await pipelineToolClient.verify(params);
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
