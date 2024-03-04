import { SourceControlVerifyRequestDTO } from '@src/clients/sourceControl/dto/request';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { updateSourceControlVerifyState } from '@src/context/config/configSlice';
import { useAppDispatch } from '@src/hooks/index';
import { useCallback, useState } from 'react';
import { HttpStatusCode } from 'axios';

export const useVerifySourceControlTokenEffect = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedError, setVerifiedError] = useState<string>();

  const verifyToken = async (params: SourceControlVerifyRequestDTO) => {
    setIsLoading(true);
    const response = await sourceControlClient.verifyToken(params);
    if (response.code === HttpStatusCode.NoContent) {
      dispatch(updateSourceControlVerifyState(true));
    } else {
      dispatch(updateSourceControlVerifyState(false));
      setVerifiedError(response.errorTitle);
    }
    setIsLoading(false);
    return response;
  };

  const clearVerifiedError = useCallback(() => {
    setVerifiedError('');
  }, []);

  return {
    verifyToken,
    isLoading,
    verifiedError,
    clearVerifiedError,
  };
};
