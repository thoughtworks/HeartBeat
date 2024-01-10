import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const Divider = styled('div')({
  paddingLeft: '0.5rem',
  borderLeft: `0.4rem solid ${theme.main.backgroundColor}`,
  margin: '0',
});
