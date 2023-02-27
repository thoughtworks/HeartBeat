import { DialogContent } from '@mui/material'
import { OkButton, StyledDialog } from '@src/components/Metrics/ConfigStep/NoDoneCardPop/style'

interface NoDoneCardPopProps {
  isOpen: boolean
  onClose: () => void
}
export const NoDoneCardPop = (props: NoDoneCardPopProps) => {
  const { isOpen, onClose } = props
  return (
    <StyledDialog open={isOpen}>
      <DialogContent>Sorry there is no card has been done, please change your collection date!</DialogContent>
      <OkButton onClick={onClose}>Ok</OkButton>
    </StyledDialog>
  )
}
