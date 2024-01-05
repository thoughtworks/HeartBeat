import styled from '@emotion/styled';
import { Alert, AlertTitle } from '@mui/material';

export const AlertWrapper = styled(Alert)((props: { backgroundcolor: string; iconcolor: string }) => ({
  backgroundColor: props.backgroundcolor,
  position: 'absolute',
  top: '4.75rem',
  right: '0.75rem',
  padding: '0.75rem 1.5rem',
  '& .MuiAlert-action': {
    padding: '0',
  },
  '& .MuiAlert-message': {
    width: '16.25rem',
  },
  '& .MuiAlert-icon': {
    color: props.iconcolor,
  },
}));

export const AlertTitleWrapper = styled(AlertTitle)({
  color: '#000000D9',
  marginBottom: '0.5rem',
});
