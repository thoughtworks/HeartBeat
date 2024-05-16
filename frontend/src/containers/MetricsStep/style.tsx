import { Divider } from '@src/components/Common/MetricsSettingTitle/style';
import { styled } from '@mui/material/styles';
import { Link } from '@mui/material';
import { theme } from '@src/theme';

export const MetricSelectionHeader = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '2rem',
});

export const MetricSelectionWrapper = styled('div')({
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '1.5rem',
  marginBottom: '1.5rem',
  borderRadius: '0.75rem',
  border: theme.main.cardBorder,
  background: theme.main.color,
  boxShadow: theme.main.cardShadow,
  position: 'relative',
});

export const MetricsSelectionTitle = styled(Divider)({
  fontSize: '1.2rem',
  lineHeight: '1.25rem',
  fontWeight: '600',
  fontFamily: 'sans-serif',
});

export const ReportSelectionTitle = styled(MetricsSelectionTitle)({
  marginBottom: '1.5rem',
});

export const ConfigSelectionTitle = styled(ReportSelectionTitle)({});

export const StyledErrorMessage = styled('span')({
  fontSize: '1.25rem',
});

export const StyledRetryButton = styled(Link)({
  marginLeft: '.5rem',
  fontWeight: '900',
  fontSize: '1.25rem',
  textDecoration: 'none',
  cursor: 'pointer',
});

export const StyledLink = styled(Link)({
  alignItems: 'center',
  display: 'flex',
  gap: '0.25rem',
  textDecoration: 'none',
  cursor: 'pointer',
});

export const StyledAlertWrapper = styled('div')({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  height: '2.5rem',
  position: 'absolute',
  top: '3.5rem',
});

export const ChartWrapper = styled('div')({
  boxSizing: 'border-box',
  height: '25rem',
  padding: '1.5rem',
  borderRadius: '0.75rem',
  border: theme.main.cardBorder,
  background: theme.main.color,
  boxShadow: theme.main.cardShadow,
  position: 'relative',
});

export const ChartContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1.25rem',
});
