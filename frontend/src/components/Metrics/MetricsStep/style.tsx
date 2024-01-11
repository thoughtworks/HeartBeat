import { styled } from '@mui/material/styles';
import { Divider } from '@src/components/Common/MetricsSettingTitle/style';

export const MetricSelectionHeader = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'relative',
  top: '1.6rem',
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
  border: '0.1rem',
  boxShadow: '0 0.25rem 1rem 0 rgba(0, 0, 0, 0.08)',
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
