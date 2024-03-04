import { StyledErrorMessage, StyledErrorSection, StyledImgSection } from '@src/components/ErrorMessagePrompt/style';
import EmptyBox from '@src/assets/EmptyBox.svg';
import React, { CSSProperties } from 'react';

export const ErrorMessagePrompt = (props: { errorMessage: string; style?: CSSProperties }) => {
  const { errorMessage, style } = props;
  return (
    <StyledErrorSection style={style}>
      <StyledImgSection src={EmptyBox} alt='empty image' />
      <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
    </StyledErrorSection>
  );
};
