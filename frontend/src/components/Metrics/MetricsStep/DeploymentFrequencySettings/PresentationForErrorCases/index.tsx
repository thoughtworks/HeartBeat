import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import errorSvg from '@src/assets/PipelineInfoError.svg';
import { IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient';
import {
  StyledContainer,
  StyledImageContainer,
  StyledImage,
  StyledCommonTitle,
  StyledCommonMessage,
  StyledRetryMessage,
  StyledRetryButton,
} from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PresentationForErrorCases/style';
import { PIPELINE_TOOL_RETRY_MESSAGE, PIPELINE_TOOL_RETRY_TRIGGER_MESSAGE } from '@src/constants/resources';
import { HEARTBEAT_EXCEPTION_CODE } from '@src/constants/resources';

export interface IPresentationForErrorCasesProps extends IGetPipelineToolInfoResult {
  retry: () => void;
  isLoading: boolean;
}

const PresentationForErrorCases = (props: IPresentationForErrorCasesProps) => {
  const handleRetry = useCallback(() => !props.isLoading && props.retry(), [props]);
  const isShowRetryUI = HEARTBEAT_EXCEPTION_CODE.TIMEOUT === props.code;
  return (
    <StyledContainer aria-label='Error UI for pipeline settings'>
      <StyledImageContainer>
        <StyledImage src={errorSvg} alt={'pipeline info error'} loading='lazy' />
      </StyledImageContainer>
      {isShowRetryUI ? (
        <StyledRetryMessage>
          <span>{PIPELINE_TOOL_RETRY_MESSAGE}</span>
          <StyledRetryButton onClick={handleRetry} isLoading={props.isLoading}>
            {PIPELINE_TOOL_RETRY_TRIGGER_MESSAGE}
          </StyledRetryButton>
        </StyledRetryMessage>
      ) : (
        <Box>
          <StyledCommonTitle>{props.errorTitle}</StyledCommonTitle>
          <StyledCommonMessage>{props.errorMessage}</StyledCommonMessage>
        </Box>
      )}
    </StyledContainer>
  );
};

export default PresentationForErrorCases;
