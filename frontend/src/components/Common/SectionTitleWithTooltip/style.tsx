import { Tooltip, TooltipProps } from '@mui/material';
import styled from '@emotion/styled';
import React from 'react';

export const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const StyledTitleContainer = styled.div((props) => ({
  margin: `1.25rem 0`,
  fontSize: '1rem',
  lineHeight: '1.25rem',
  fontWeight: '600',
  ...props.style,
}));

export const TooltipContainer = styled('div')({
  marginLeft: '0.25rem',
});

export const StyledTooltip = styled(({ className, ...props }: { className?: string } & TooltipProps) => (
  <Tooltip placement='right-start' {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    max-width: 31.25rem;
    margin-top: 0.625rem;
`);

export const StyledTitle = (props: { title: string; style?: React.CSSProperties }) => (
  <StyledTitleContainer style={props.style || {}}>{props.title}</StyledTitleContainer>
);
