import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import styled from '@emotion/styled';
import { theme } from '@src/theme';
import { InputProps } from '@mui/material';

export const basicStyle = {
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  margin: '2rem',
  width: '15rem',
  minWidth: '10rem',
  minHeight: '3rem',
  [theme.breakpoints.down('md')]: {
    width: '80%',
    maxWidth: '15rem',
  },
};
export const GuideButton = styled(Button)<ButtonProps>({
  ...basicStyle,
  '&:hover': {
    ...basicStyle,
  },
  '&:active': {
    ...basicStyle,
  },
  '&:focus': {
    ...basicStyle,
  },
});

export const StyledStack = styled(Stack)<ButtonProps>({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
});

export const HomeGuideContainer = styled.div({
  height: '44rem',
  position: 'relative',
});

export const ImportFileWrapper = styled.input<InputProps>({
  display: 'none',
})
