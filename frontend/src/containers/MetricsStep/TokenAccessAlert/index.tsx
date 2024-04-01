import { StyledAlert, StyledBoldText, StyledText } from '@src/containers/MetricsStep/TokenAccessAlert/style';
import { AUTHORIZE_ORGANIZATION_LINK, GENERATE_GITHUB_TOKEN_LINK } from '@src/constants/resources';
import EllipsisText from '@src/components/Common/EllipsisText';
import CancelIcon from '@mui/icons-material/Cancel';

interface AlertTextContentProps {
  errorDetail: number;
}

export const AlertTextContent = ({ errorDetail }: AlertTextContentProps) => {
  return (
    <>
      {errorDetail === 401 && (
        <StyledText>
          <StyledBoldText>Unauthorized token:</StyledBoldText> please authorize your{' '}
          <StyledBoldText>Github</StyledBoldText> token with{' '}
          <a href={AUTHORIZE_ORGANIZATION_LINK} target='_blank' rel='noreferrer'>
            correct organization
          </a>
        </StyledText>
      )}
      {errorDetail === 400 && (
        <StyledText>
          <StyledBoldText>Limited access token:</StyledBoldText> please change your{' '}
          <StyledBoldText>Github</StyledBoldText> token with{' '}
          <a href={GENERATE_GITHUB_TOKEN_LINK} target='_blank' rel='noreferrer'>
            correct access permission
          </a>
        </StyledText>
      )}
    </>
  );
};

interface TokenAccessAlertProps {
  errorDetail?: number;
}

export const TokenAccessAlert = ({ errorDetail }: TokenAccessAlertProps) => {
  return errorDetail && errorDetail !== 404 ? (
    <StyledAlert aria-label='alert for token access error' icon={<CancelIcon fontSize='inherit' />} severity='error'>
      <EllipsisText fitContent>
        <AlertTextContent errorDetail={errorDetail} />
      </EllipsisText>
    </StyledAlert>
  ) : null;
};
