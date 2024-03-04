import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { theme } from '@src/theme';

export const CollectionDateContainer = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
  margin: '0 auto 2rem',
});

export const TextBox = styled(Paper)({
  width: '3rem',
  height: '2rem',
  padding: '0.75rem',
  border: '0 solid #ccc',
  boxShadow: `0 0.125rem 0.5rem ${theme.palette.secondary.contrastText}`,
  borderBottomLeftRadius: '0.375rem',
  borderBottomRightRadius: '0.375rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const GreyTransitionBox = styled('div')({
  width: '10rem',
  height: '3.5rem',
  backgroundColor: theme.palette.info.light,
  border: 0,
  borderRadius: 0,
});

export const ColoredTopArea = styled('div')((props: { isStart: boolean }) => ({
  width: '100%',
  height: '0.625rem',
  backgroundColor: props.isStart ? theme.palette.info.light : theme.palette.info.dark,
  borderTopLeftRadius: '0.375rem',
  borderTopRightRadius: '0.375rem',
}));

export const DateTitle = styled('div')((props: { isStart: boolean }) => ({
  fontSize: '0.625rem',
  color: props.isStart ? theme.palette.info.light : theme.palette.info.dark,
  textAlign: 'center',
  letterSpacing: '0.1em',
  padding: '0.25rem 0',
  fontWeight: 'bold',
  marginBottom: '0.125rem',
}));

export const DateText = styled('div')({
  fontSize: '1.5rem',
  letterSpacing: '0.1rem',
});

export const MonthYearText = styled('div')({
  fontSize: '0.625rem',
  marginBottom: '0.3rem',
});
