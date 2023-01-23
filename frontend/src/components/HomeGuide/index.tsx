import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled, ThemeProvider } from '@mui/material/styles';

import theme from '@src/theme';

const basicStyle = {
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  margin: '2rem',
  width: '20rem',
  minWidth: '10rem',
  minHeight: '3rem',
};
const ImportButton = styled(Button)<ButtonProps>({
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

const HomeGuide = () => {
  return (
    <Stack direction='column' spacing={2} justifyContent='center' alignItems='center' flex={'auto'}>
      <ThemeProvider theme={theme}>
        <ImportButton>Import project from file</ImportButton>
        <ImportButton>Create a new project</ImportButton>
      </ThemeProvider>
    </Stack>
  );
};

export default HomeGuide;
