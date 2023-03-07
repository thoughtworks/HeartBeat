import { CircularProgress } from '@mui/material'
import { BoardLoadingDrop } from './style'

export const Loading = () => {
  return (
    <BoardLoadingDrop open>
      <CircularProgress size='8rem' />
    </BoardLoadingDrop>
  )
}
