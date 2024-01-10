import React from 'react';
import { StyledText } from '@src/components/Common/EllipsisText/style';

interface IEllipsisTextProps {
  children: React.ReactNode;
  fitContent: boolean;
  ref: React.ForwardedRef<HTMLParagraphElement>;
}

export default React.forwardRef<HTMLParagraphElement, IEllipsisTextProps>(function RefWrapper(
  props: IEllipsisTextProps,
  ref: React.ForwardedRef<HTMLParagraphElement>
) {
  return (
    <StyledText {...props} ref={ref}>
      {props.children}
    </StyledText>
  );
});
