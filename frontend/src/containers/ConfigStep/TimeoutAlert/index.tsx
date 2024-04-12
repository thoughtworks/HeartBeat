import { StyledAlert } from '@src/containers/ConfigStep/TimeoutAlert/style';
import EllipsisText from '@src/components/Common/EllipsisText';
import BoldText from '@src/components/Common/BoldText';
import CancelIcon from '@mui/icons-material/Cancel';

interface PropsInterface {
  isVerifyTimeOut: boolean;
  isShowAlert: boolean;
  setIsShowAlert: (value: boolean) => void;
  moduleType: string;
}
export const TimeoutAlert = ({ isVerifyTimeOut, isShowAlert, setIsShowAlert, moduleType }: PropsInterface) => {
  return (
    <>
      {isVerifyTimeOut && isShowAlert && (
        <StyledAlert
          data-testid='timeoutAlert'
          icon={<CancelIcon fontSize='inherit' />}
          severity='error'
          onClose={() => {
            setIsShowAlert(false);
          }}
        >
          <EllipsisText fitContent>
            Submission timeout on <BoldText>{moduleType}</BoldText>, please reverify!
          </EllipsisText>
        </StyledAlert>
      )}
    </>
  );
};
