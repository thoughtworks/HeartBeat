import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { theme } from '@src/theme';

interface IStyledRetryButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem 0',
});

export const StyledImageContainer = styled(Box)({
  maxHeight: '6rem',
  height: '6rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
});

export const StyledImage = styled('img')({
  display: 'block',
  width: 'auto',
  height: '100%',
  maxHeight: '100%',
});

export const StyledCommonTitle = styled(Box)({
  fontSize: '1.25rem',
  fontWeight: 700,
  marginTop: '0.5rem',
  marginBottom: '1.25rem',
  textAlign: 'center',
});

export const StyledCommonMessage = styled(Box)({
  fontSize: '0.9375rem',
  fontWeight: 400,
  paddingBottom: '2rem',
  textAlign: 'center',
});

export const StyledRetryMessage = styled('span')({
  fontSize: '1.25rem',
  fontWeight: 400,
  paddingTop: '3rem',
  paddingBottom: '1rem',
  textAlign: 'center',
  color: theme.palette.secondary.contrastText,
});

export const StyledRetryButton1 = styled('span')({
  fontWeight: 700,
  color: theme.palette.primary.main,
});

export const StyledRetryButton = styled('span')`
  cursor: ${(props: IStyledRetryButtonProps) => (props.isLoading ? 'not-allowed' : 'pointer')};
  font-weight: 700;
  color: ${(props: IStyledRetryButtonProps) =>
    props.isLoading ? theme.palette.secondary.contrastText : theme.palette.primary.main};
`;
