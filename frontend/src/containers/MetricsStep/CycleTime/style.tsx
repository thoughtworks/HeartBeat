import { styled } from '@mui/material/styles';
import { Checkbox } from '@mui/material';

export const FlagCardItem = styled('div')({
  display: 'flex',
  margin: '0.5rem 0',
});

export const ItemText = styled('div')({
  padding: '0',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  fontWeight: '400',
});

export const ItemCheckbox = styled(Checkbox)({
  padding: 0,
  marginRight: '0.5rem',
});

export const TitleAndTooltipContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const TooltipContainer = styled('div')({
  marginLeft: '0.25rem',
});
