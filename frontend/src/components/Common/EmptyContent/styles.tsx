import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const StyledErrorSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem 0',
});

export const StyledImgSection = styled.img({
  height: '5.75rem',
  marginBottom: '1rem',
});

export const StyledErrorMessage = styled.div({
  color: theme.main.button.disabled.color,
  fontSize: '0.875rem',
});

export const StyledErrorTitle = styled.div({
  fontWeight: 700,
  fontSize: '1.25rem',
  marginBottom: '1.625rem',
});
