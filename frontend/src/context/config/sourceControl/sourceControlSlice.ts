import { initSourceControlVerifyResponseState, ISourceControlVerifyResponse } from './verifyResponseSlice';
import { SOURCE_CONTROL_TYPES } from '@src/constants/resources';

export interface ISourceControl {
  config: { type: string; token: string };
  isVerified: boolean;
  isShow: boolean;
  verifiedResponse: ISourceControlVerifyResponse;
}

export const initialSourceControlState: ISourceControl = {
  config: {
    type: SOURCE_CONTROL_TYPES.GITHUB,
    token: '',
  },
  isVerified: false,
  isShow: false,
  verifiedResponse: initSourceControlVerifyResponseState,
};
