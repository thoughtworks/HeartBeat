import React from 'react'
import { IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient'
import {
  StyledContainer,
  StyledImageContainer,
  StyledImage,
  StyledTitle,
  StyledMessage,
} from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PresentationForErrorCases/style'

const PresentationForErrorCases = (props: IGetPipelineToolInfoResult) => {
  return (
    <StyledContainer display={'flex'} flexDirection='column'>
      <StyledImageContainer>
        <StyledImage src={`/pipeline-info-error.png`} alt={'pipeline info error'} loading='lazy' />
      </StyledImageContainer>
      <StyledTitle>{props.errorTitle}</StyledTitle>
      <StyledMessage>{props.errorMessage}</StyledMessage>
    </StyledContainer>
  )
}

export default PresentationForErrorCases
