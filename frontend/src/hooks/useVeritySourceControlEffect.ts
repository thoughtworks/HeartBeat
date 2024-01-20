import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { SourceControlRequestDTO } from '@src/clients/sourceControl/dto/request';
import { MESSAGE } from '@src/constants/resources';
import { DURATION } from '@src/constants/commons';
import { useState } from 'react';

export interface useVerifySourceControlStateInterface {
  verifyGithub: (params: SourceControlRequestDTO) => Promise<
    | {
        isSourceControlVerify: boolean;
        response: object;
      }
    | undefined
  >;
  isLoading: boolean;
  errorMessage: string;
}

export const useVerifySourceControlEffect = (): useVerifySourceControlStateInterface => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const verifyGithub = async (params: SourceControlRequestDTO) => {
    setIsLoading(true);
    try {
      return await sourceControlClient.getVerifySourceControl(params);
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
    verifyGithub,
    isLoading,
    errorMessage,
  };
};
