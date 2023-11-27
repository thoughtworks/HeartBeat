import { CircularProgress } from '@mui/material'
import { LoadingDrop, LoadingTypography } from './style'

export interface LoadingProps {
  message?: string
}

export const Loading = ({ message }: LoadingProps) => {
  return (
    <LoadingDrop open>
      <CircularProgress size='8rem' data-testid='loading-page' />
      {message && <LoadingTypography>{message}</LoadingTypography>}
    </LoadingDrop>
  )
}
