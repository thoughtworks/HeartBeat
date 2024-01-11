import React, { useCallback } from 'react'
import { Box } from '@mui/material'
import { IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient'
import {
  StyledContainer,
  StyledImageContainer,
  StyledImage,
  StyledCommonTitle,
  StyledCommonMessage,
  StyledRetryMessage,
  StyledRetryButton,
} from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PresentationForErrorCases/style'
import { HttpStatusCode } from 'axios'

export interface IPresentationForErrorCasesProps extends IGetPipelineToolInfoResult {
  retry: () => void
  isLoading: boolean
}

const PresentationForErrorCases = (props: IPresentationForErrorCasesProps) => {
  const handleRetry = useCallback(() => !props.isLoading && props.retry(), [props])
  return (
    <StyledContainer aria-label='Error UI for pipeline settings'>
      <StyledImageContainer>
        <StyledImage src={`/pipeline-info-error.png`} alt={'pipeline info error'} loading='lazy' />
      </StyledImageContainer>
      {props.code === HttpStatusCode.ServiceUnavailable ? (
        <StyledRetryMessage>
          <span>Data loading failed, please</span>
          <StyledRetryButton onClick={handleRetry} isLoading={props.isLoading}>
            {' '}
            try again
          </StyledRetryButton>
        </StyledRetryMessage>
      ) : (
        <Box>
          <StyledCommonTitle>{props.errorTitle}</StyledCommonTitle>
          <StyledCommonMessage>{props.errorMessage}</StyledCommonMessage>
        </Box>
      )}
    </StyledContainer>
  )
}

export default PresentationForErrorCases
