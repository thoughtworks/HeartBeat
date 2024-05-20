import { StyledAlert } from '@src/containers/ConfigStep/FormAlert/style';
import EllipsisText from '@src/components/Common/EllipsisText';
import { formAlertTypes } from '@src/constants/commons';
import BoldText from '@src/components/Common/BoldText';
import CancelIcon from '@mui/icons-material/Cancel';
import React from 'react';

interface PropsInterface {
  showAlert: boolean;
  onClose: () => void;
  moduleType?: string;
  formAlertType: formAlertTypes;
}

const FormAlertAriaLabelMap = (formAlertType: formAlertTypes): string => {
  const formAlertAriaLabelMap = {
    [formAlertTypes.TIMEOUT]: 'timeoutAlert',
    [formAlertTypes.BOARD_VERIFY]: 'boardVerifyAlert',
  };

  return formAlertAriaLabelMap[formAlertType];
};

export const FormAlert = ({ showAlert, onClose, moduleType, formAlertType }: PropsInterface) => {
  const renderMessage = () => {
    if (formAlertType === formAlertTypes.TIMEOUT) {
      return (
        <EllipsisText fitContent>
          Submission timeout on <BoldText>{moduleType}</BoldText>, please reverify!
        </EllipsisText>
      );
    } else if (formAlertType === formAlertTypes.BOARD_VERIFY) {
      return (
        <EllipsisText fitContent>
          <BoldText>Email</BoldText> and <BoldText>Token</BoldText> are bound for verification. Please modify at least
          one of the Email or Token before reverify!
        </EllipsisText>
      );
    }
  };

  return (
    <>
      {showAlert && (
        <StyledAlert
          aria-label={FormAlertAriaLabelMap(formAlertType)}
          icon={<CancelIcon fontSize='inherit' />}
          severity='error'
          onClose={onClose}
        >
          {renderMessage()}
        </StyledAlert>
      )}
    </>
  );
};
