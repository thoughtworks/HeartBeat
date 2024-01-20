import { MetricSelectionWrapper } from '@src/containers/MetricsStep/style';
import { FormControl, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const ConfigSectionContainer = styled(MetricSelectionWrapper)({});

export const StyledForm = styled('form')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  marginTop: '1rem',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
});

export const StyledTypeSelections = styled(FormControl)({});

export const StyledTextField = styled(TextField)`
  input {
    padding: 0.56rem 0;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export const StyledButtonGroup = styled('div')({
  justifySelf: 'end',
  gridColumn: '2 / 3',
});
