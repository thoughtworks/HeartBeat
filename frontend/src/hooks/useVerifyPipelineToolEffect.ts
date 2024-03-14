import { initDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';
import { updatePipelineToolVerifyState } from '@src/context/config/configSlice';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { IPipelineVerifyRequestDTO } from '@src/clients/pipeline/dto/request';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { useAppDispatch } from '@src/hooks';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';

export const useVerifyPipelineToolEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedError, setVerifiedError] = useState('');
  const dispatch = useAppDispatch();
  const [isVerifyTimeOut, setIsVerifyTimeOut] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const verifyPipelineTool = async (params: IPipelineVerifyRequestDTO): Promise<void> => {
    setIsLoading(true);
    const response = await pipelineToolClient.verify(params, setIsVerifyTimeOut, setIsShowAlert);
    if (response.code === HttpStatusCode.NoContent) {
      dispatch(updatePipelineToolVerifyState(true));
      dispatch(initDeploymentFrequencySettings());
    } else if (response.code === AXIOS_REQUEST_ERROR_CODE.TIMEOUT) {
      setIsVerifyTimeOut(true);
      setIsShowAlert(true);
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
    isVerifyTimeOut,
    isShowAlert,
    setIsShowAlert,
  };
};
