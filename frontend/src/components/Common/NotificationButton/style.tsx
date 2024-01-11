import styled from '@emotion/styled';
import { Alert, AlertTitle } from '@mui/material';

export const AlertIconImage = styled.img({
  height: '1.5rem',
  width: '1.5rem',
});

export const AlertWrapper = styled(Alert)({
  backgroundColor: '#E9ECFF',
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
});

export const AlertTitleWrapper = styled(AlertTitle)({
  color: '#000000D9',
  marginBottom: '0.5rem',
});
