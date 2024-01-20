import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const StyledReportCard = styled.div({
  position: 'relative',
  padding: '0.8rem 1.5rem 0.8rem 1.5rem',
  height: '6.5rem',
  borderRadius: '1rem',
  border: theme.main.cardBorder,
  background: theme.main.color,
  boxShadow: theme.main.cardShadow,
});

export const StyledItemSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  minWidth: '25%',
  padding: '0.75rem 0',
});

export const StyledReportCardTitle = styled(Typography)({
  fontWeight: 500,
  fontSize: '1rem',
});

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
