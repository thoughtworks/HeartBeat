import { Placement } from '@src/components/Loading/index';
import { Backdrop, Typography } from '@mui/material';
import { Z_INDEX } from '@src/constants/commons';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const LoadingDrop = styled(Backdrop)((props: { placement: Placement }) => ({
  position: 'absolute',
  zIndex: Z_INDEX.MODAL_BACKDROP,
  backgroundColor: theme.main.loading.backgroundColor,
  color: theme.main.backgroundColor,
  display: 'flex',
  flexDirection: 'column',
  alignItems: props.placement === 'center' ? 'center' : 'flex-start',
  justifyContent: 'center',
}));

export const LoadingTypography = styled(Typography)({
  fontSize: '1rem',
  marginTop: '2rem',
  color: theme.main.secondColor,
});
