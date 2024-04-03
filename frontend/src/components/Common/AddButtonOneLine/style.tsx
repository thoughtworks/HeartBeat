import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const StyledButton = styled(Button)({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '0.25rem',
  border: `0.07rem dashed ${theme.main.alert.info.iconColor}`,
  width: '100%',
});
