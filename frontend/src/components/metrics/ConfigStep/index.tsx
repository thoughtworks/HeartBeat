import { Box, TextField } from '@mui/material'
import React from 'react'

export const ConfigStep = () => {
  return (
    <Box
      component='form'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete='off'
    >
      <div>
        <TextField required id='standard-error-helper-text' label='Project Name' variant='standard' />
      </div>
    </Box>
  )
}
