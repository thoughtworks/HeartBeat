import { OkButton, StyledDialog } from '@src/containers/ConfigStep/NoDoneCardPop/style';
import { DialogContent } from '@mui/material';

interface NoDoneCardPopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoCardPop = (props: NoDoneCardPopProps) => {
  const { isOpen, onClose } = props;
  return (
    <StyledDialog open={isOpen}>
      <DialogContent>
        Sorry there is no card within selected date range, please change your collection date!
      </DialogContent>
      <OkButton onClick={onClose}>Ok</OkButton>
    </StyledDialog>
  );
};
