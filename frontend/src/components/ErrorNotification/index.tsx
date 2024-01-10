import { ErrorBar, StyledAlert } from './style';

export const ErrorNotification = (props: { message: string }) => {
  const { message } = props;
  return (
    <ErrorBar open={true}>
      <StyledAlert severity='error'>{message}</StyledAlert>
    </ErrorBar>
  );
};
