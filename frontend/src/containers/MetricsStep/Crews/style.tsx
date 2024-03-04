import { styled } from '@mui/material/styles';
import { RadioGroup } from '@mui/material';

export const StyledRadioGroup = styled(RadioGroup)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  paddingTop: '1rem',
});

export const WarningMessage = styled('span')({
  color: 'red',
});
