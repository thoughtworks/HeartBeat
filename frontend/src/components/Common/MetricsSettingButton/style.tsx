import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const MetricsSettingAddButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '0.25rem',
  border: `0.07rem dashed ${theme.main.alert.info.iconColor}`,
  marginBottom: '1rem',
});

export const MetricsSettingAddButtonItem = styled(Button)({
  width: '100%',
});
