import { ErrorBar, StyledAlert } from './style';

export const ErrorNotification = (props: { message: string }) => {
  const { message } = props;
  return (
    <ErrorBar aria-label='Error notification bar' open={true}>
      <StyledAlert severity='error'>{message}</StyledAlert>
    </ErrorBar>
  );
};
