import { initDeploymentFrequencySettings, updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { SOURCE_CONTROL_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { SourceControlVerifyRequestDTO } from '@src/clients/sourceControl/dto/request';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { useDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { TSourceControlFieldKeys } from '@src/containers/ConfigStep/Form/type';
import { ISourceControlData } from '@src/containers/ConfigStep/Form/schema';
import { updateSourceControl } from '@src/context/config/configSlice';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { useAppDispatch } from '@src/hooks/index';
import { useFormContext } from 'react-hook-form';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';

export enum FIELD_KEY {
  TYPE = 0,
  TOKEN = 1,
}

interface IField {
  key: TSourceControlFieldKeys;
  label: string;
}

export const useVerifySourceControlTokenEffect = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const fields: IField[] = [
    { key: 'type', label: 'Source Control' },
    { key: 'token', label: 'Token' },
  ];
  const { sourceControlOriginal } = useDefaultValues();
  const { reset, setError, getValues } = useFormContext();
  const persistReduxData = (sourceControlConfig: ISourceControlData) => {
    dispatch(updateSourceControl(sourceControlConfig));
    dispatch(updateShouldGetPipelineConfig(true));
    dispatch(initDeploymentFrequencySettings());
  };
  const resetFields = () => {
    reset(sourceControlOriginal);
  };

  const verifyToken = async () => {
    setIsLoading(true);
    const values = getValues() as SourceControlVerifyRequestDTO;
    const response = await sourceControlClient.verifyToken(values);
    if (response.code === HttpStatusCode.NoContent) {
      persistReduxData(values);
      reset(sourceControlOriginal, { keepValues: true });
    } else if (response.code === AXIOS_REQUEST_ERROR_CODE.TIMEOUT) {
      setError(fields[FIELD_KEY.TOKEN].key, { message: SOURCE_CONTROL_ERROR_MESSAGE.token.timeout });
    } else if (response.code === HttpStatusCode.Unauthorized) {
      setError(fields[FIELD_KEY.TOKEN].key, { message: SOURCE_CONTROL_ERROR_MESSAGE.token.unauthorized });
    } else {
      setError(fields[FIELD_KEY.TOKEN].key, { message: response.errorTitle });
    }
    setIsLoading(false);
    return response;
  };

  return {
    verifyToken,
    isLoading,
    fields,
    resetFields,
  };
};
