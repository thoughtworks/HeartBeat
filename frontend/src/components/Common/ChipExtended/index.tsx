import { SyntheticEvent, useCallback, useMemo } from 'react';
import ReplayIcon from '@mui/icons-material/Replay';
import { ChipProps } from '@mui/material/Chip/Chip';
import { CircularProgress } from '@mui/material';
import { StyledChip } from './style';

interface Props extends ChipProps {
  showRetry?: boolean;
  onRetry?: () => void;
  loading?: boolean;
  error?: boolean;
}

const ChipExtended = ({ loading, error, onRetry, onDelete, showRetry, ...rest }: Props) => {
  const Icon = useMemo(() => {
    if (loading) return <CircularProgress size='1.25rem' />;
    if (showRetry) return <ReplayIcon />;
  }, [loading, showRetry]);

  const handleRightIconTap = useCallback(
    (event: SyntheticEvent) => {
      if (showRetry && onRetry) return onRetry();
      if (!loading && onDelete) return onDelete(event);
    },
    [loading, onDelete, onRetry, showRetry],
  );

  const classnames = useMemo(() => {
    if (loading) return 'with-loading';
    if (showRetry) return 'with-retry';
    if (error) return 'with-error';
  }, [error, loading, showRetry]);

  return <StyledChip {...rest} deleteIcon={Icon} onDelete={handleRightIconTap} className={classnames}></StyledChip>;
};

export default ChipExtended;
