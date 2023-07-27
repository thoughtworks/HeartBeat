import { CircularProgress } from '@mui/material'
import { LoadingDrop } from './style'

export const Loading = () => {
  return (
    <LoadingDrop open>
      <CircularProgress size='8rem' data-testid='loading-page' />
    </LoadingDrop>
  )
}
