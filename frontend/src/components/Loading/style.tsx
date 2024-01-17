import { styled } from '@mui/material/styles';
import { Backdrop, Typography } from '@mui/material';
import { theme } from '@src/theme';
import { Z_INDEX } from '@src/constants/commons';
import { Placement } from '@src/components/Loading/index';

export const LoadingDrop = styled(Backdrop)((props: { placement: Placement }) => ({
  position: 'absolute',
  zIndex: Z_INDEX.MODAL_BACKDROP,
  backgroundColor: 'rgba(199,199,199,0.43)',
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
