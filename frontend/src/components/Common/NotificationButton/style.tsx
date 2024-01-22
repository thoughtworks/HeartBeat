import { Alert, AlertTitle } from '@mui/material';
import { Z_INDEX } from '@src/constants/commons';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const NotificationContainer = styled('div')({
  position: 'fixed',
  zIndex: Z_INDEX.FIXED,
  top: '4rem',
  right: '0.75rem',
});

export const AlertWrapper = styled(Alert)(
  (props: { backgroundcolor: string; iconcolor: string; bordercolor: string }) => ({
    backgroundColor: props.backgroundcolor,
    marginTop: '0.75rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: `0.0625rem solid ${props.bordercolor}`,
    '& .MuiAlert-action': {
      padding: '0',
    },
    '& .MuiAlert-message': {
      width: '16.25rem',
    },
    '& .MuiAlert-icon': {
      color: props.iconcolor,
    },
  }),
);

export const AlertTitleWrapper = styled(AlertTitle)({
  color: theme.main.alert.title.color,
  marginBottom: '0.5rem',
});
