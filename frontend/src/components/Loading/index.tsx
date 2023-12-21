import { CircularProgress } from '@mui/material'
import { LoadingDrop, LoadingTypography } from './style'

export interface LoadingProps {
  message?: string
  size?: string
  backgroundColor?: string
}

export const Loading = ({ message, size = '8rem', backgroundColor }: LoadingProps) => {
  return (
    <LoadingDrop open style={{ backgroundColor: backgroundColor }}>
      <CircularProgress size={size} data-testid='loading-page' />
      {message && <LoadingTypography>{message}</LoadingTypography>}
    </LoadingDrop>
  )
}
