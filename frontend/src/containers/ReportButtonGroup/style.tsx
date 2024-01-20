import { basicButtonStyle } from '@src/containers/ReportStep/style';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { theme } from '@src/theme';

export const StyledRightButtonGroup = styled('div')({
  [theme.breakpoints.down('lg')]: {
    width: '85%',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
  },
});

export const StyledButtonGroup = styled('div')`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  justify-content: ${(props: { isShowSave: boolean }) => (props.isShowSave ? 'space-between' : 'flex-end')};
  width: 100%;
  padding-top: 2rem;
`;

export const StyledExportButton = styled(Button)({
  ...basicButtonStyle,
  width: '12rem',
  whiteSpace: 'nowrap',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
    [theme.breakpoints.down('lg')]: {
      fontSize: '0.8rem',
    },
  },
  '&:disabled': {
    backgroundColor: theme.main.button.disabled.backgroundColor,
    color: theme.main.button.disabled.color,
  },
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.8rem',
  },
});
