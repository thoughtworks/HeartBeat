import { basicButtonStyle } from '@src/containers/MetricsStepper/style';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '6rem',
  minHeight: '30rem',
  minWidth: '60rem',
});

export const ErrorTitle = styled.div({
  paddingLeft: '6rem',
  position: 'relative',
});

export const ErrorImg = styled.img({
  height: '7rem',
});

export const Some = styled.span({
  fontSize: '2.5rem',
  fontWeight: '600',
  paddingLeft: '1rem',
});

export const Error = styled.span({
  paddingLeft: '1rem',
  fontSize: '4.5rem',
  fontWeight: '600',
  letterSpacing: '-0.5rem',
  color: 'firebrick',
});

export const ErrorMessage = styled.div({
  display: 'flex',
  flexDirection: 'row',
  paddingRight: '12rem',
});

export const OhNo = styled.span({
  fontSize: '7rem',
  fontWeight: '750',
  letterSpacing: '0.2rem',
});

export const Okay = styled.span({
  margin: 'auto 0',
  paddingLeft: '1rem',
  fontSize: '1.5rem',
  fontWeight: '250',
  color: theme.main.backgroundColor,
});

export const ErrorInfo = styled.div({
  padding: '2rem',
  fontSize: '1rem',
  fontWeight: '250',
});

export const RetryButton = styled(Button)({
  ...basicButtonStyle,
  height: '3rem',
  width: '12rem',
  marginTop: '2rem',
  backgroundColor: theme.main.backgroundColor,
  color: 'white',
  '&:hover': {
    background: theme.main.backgroundColor,
  },
});
