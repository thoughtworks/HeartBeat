import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const StyledErrorSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledImgSection = styled.img({
  height: '3.8rem',
});

export const StyledErrorMessage = styled.div({
  color: theme.main.errorMessage.color,
  fontSize: '0.875rem',
});
