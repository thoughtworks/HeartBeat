import React from 'react'
import { IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient'
import { Box } from '@mui/material'

const PresentationForErrorCases = (props: IGetPipelineToolInfoResult) => {
  return (
    <Box display={'flex'} flexDirection='column'>
      <Box>Here lays the Image</Box>
      <Box>{props.errorTitle}</Box>
      <Box>{props.errorMessage}</Box>
    </Box>
  )
}

export default PresentationForErrorCases
