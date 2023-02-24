import { DialogContent } from '@mui/material'
import { OkButton, StyledDialog } from '@src/components/Metrics/ConfigStep/NoCardPop/style'
interface NoCardNotationProps {
  isOpen: boolean
  onClose: () => void
}
export const NoCardPop = (props: NoCardNotationProps) => {
  const { isOpen, onClose } = props
  const handleClose = () => {
    onClose()
  }
  return (
    <StyledDialog open={isOpen}>
      <DialogContent>Sorry there is no card has been done, please change your collection date!</DialogContent>
      <OkButton onClick={handleClose}>Ok</OkButton>
    </StyledDialog>
  )
}
