import { DialogContent } from '@mui/material'
import { OkButton, StyledDialog } from '@src/components/Metrics/ConfigStep/NoDoneCardPop/style'

interface NoDoneCardPopProps {
  isOpen: boolean
  onClose: () => void
}

export const NoCardPop = (props: NoDoneCardPopProps) => {
  const { isOpen, onClose } = props
  return (
    <StyledDialog open={isOpen}>
      <DialogContent>
        Sorry there is no card within selected date range, please change your collection date!
      </DialogContent>
      <OkButton onClick={onClose}>Ok</OkButton>
    </StyledDialog>
  )
}
