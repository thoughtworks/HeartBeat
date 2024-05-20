import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { theme } from '@src/theme';

export const StyledAlert = styled(Alert)({
  '&.MuiPaper-root': {
    flex: 1,
    border: `0.07rem solid ${theme.main.alert.error.borderColor}`,
    backgroundColor: theme.main.alert.error.backgroundColor,
    borderRadius: '0.5rem',
    padding: '0 1rem',
    maxWidth: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    '&.MuiAlert-icon': {
      marginTop: '0.125rem',
    },
  },
});
