import { StyledAlert } from '@src/containers/ConfigStep/TimeoutAlert/style';
import EllipsisText from '@src/components/Common/EllipsisText';
import BoldText from '@src/components/Common/BoldText';
import CancelIcon from '@mui/icons-material/Cancel';

interface PropsInterface {
  showAlert: boolean;
  onClose: () => void;
  moduleType: string;
}
export const TimeoutAlert = ({ showAlert, onClose, moduleType }: PropsInterface) => {
  return (
    <>
      {showAlert && (
        <StyledAlert
          data-testid='timeoutAlert'
          icon={<CancelIcon fontSize='inherit' />}
          severity='error'
          onClose={onClose}
        >
          <EllipsisText fitContent>
            Submission timeout on <BoldText>{moduleType}</BoldText>, please reverify!
          </EllipsisText>
        </StyledAlert>
      )}
    </>
  );
};
