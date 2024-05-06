import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const GridContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});
export const StyledMetricsSection = styled('div')({
  marginTop: '2rem',
});
export const StyledTitleWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  position: 'relative',
});
export const StyledShowMore = styled('div')({
  marginLeft: '0.5rem',
  fontSize: '0.8rem',
  textDecoration: 'none',
  color: theme.main.alert.info.iconColor,
  cursor: 'pointer',
});
export const StyledLoading = styled('div')({
  position: 'relative',
  left: '1rem',
});
export const StyledRetry = styled('div')({
  // todo: update retry logic
  display: 'none',
  marginLeft: '0.5rem',
  fontSize: '0.8rem',
  textDecoration: 'none',
  color: theme.main.alert.info.iconColor,
  cursor: 'pointer',
});
