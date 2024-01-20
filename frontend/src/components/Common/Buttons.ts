import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { theme } from '@src/theme';

export const BasicButton = styled(Button)({
  width: '3rem',
  fontSize: '0.8rem',
  fontFamily: theme.main.font.secondary,
  fontWeight: 'bold',
});

export const VerifyButton = styled(BasicButton)({});
export const ResetButton = styled(BasicButton)({
  color: theme.components?.errorMessage.color,
  marginLeft: '0.5rem',
});
