import { initialPipelineToolVerifiedResponseState, IPipelineToolVerifyResponse } from './verifyResponseSlice';
import { PIPELINE_TOOL_TYPES } from '@src/constants/resources';

export interface IPipelineToolState {
  config: { type: string; token: string };
  isShow: boolean;
  verifiedResponse: IPipelineToolVerifyResponse;
}

export const initialPipelineToolState: IPipelineToolState = {
  config: {
    type: PIPELINE_TOOL_TYPES.BUILD_KITE,
    token: '',
  },
  isShow: false,
  verifiedResponse: initialPipelineToolVerifiedResponseState,
};
