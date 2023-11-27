import { CircularProgress } from '@mui/material'
import { LoadingDrop, LoadingTypography } from './style'

export const Loading = ({ wording }: { wording: string }) => {
  return (
    <LoadingDrop open>
      <CircularProgress size='8rem' data-testid='loading-page' />
      {wording && <LoadingTypography>wording</LoadingTypography>}
    </LoadingDrop>
  )
}
