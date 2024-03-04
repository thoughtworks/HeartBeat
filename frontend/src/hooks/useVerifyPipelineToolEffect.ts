import { initDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';
import { updatePipelineToolVerifyState } from '@src/context/config/configSlice';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { IPipelineVerifyRequestDTO } from '@src/clients/pipeline/dto/request';
import { useAppDispatch } from '@src/hooks';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';

export const useVerifyPipelineToolEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedError, setVerifiedError] = useState('');
  const dispatch = useAppDispatch();

  const verifyPipelineTool = async (params: IPipelineVerifyRequestDTO): Promise<void> => {
    setIsLoading(true);
    const response = await pipelineToolClient.verify(params);
    if (response.code === HttpStatusCode.NoContent) {
      dispatch(updatePipelineToolVerifyState(true));
      dispatch(initDeploymentFrequencySettings());
    } else {
      setVerifiedError(response.errorTitle);
    }
    setIsLoading(false);
  };

  const clearVerifiedError = () => {
    if (verifiedError) setVerifiedError('');
  };

  return {
    verifyPipelineTool,
    isLoading,
    verifiedError,
    clearVerifiedError,
  };
};
