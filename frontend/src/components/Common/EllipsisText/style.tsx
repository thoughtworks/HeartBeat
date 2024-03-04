import { ellipsisProps } from '@src/layouts/style';
import styled from '@emotion/styled';

export const StyledText = styled.p(({ fitContent }: { fitContent: boolean }) => ({
  maxWidth: '100%',
  width: fitContent ? 'fit-content' : 'auto',
  ...ellipsisProps,
}));
