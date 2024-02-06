import { Divider } from '@src/components/Common/MetricsSettingTitle/style';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
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

export const StyledRetryButton = styled(Button)({
  fontWeight: '700',
  minWidth: '3.4rem',
  padding: '0',
});
