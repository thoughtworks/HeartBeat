import styled from '@emotion/styled';
import { theme } from '@src/theme';

const DescriptionContainer = styled.p({
  padding: '1rem',
  marginTop: '0',
  boxShadow: `0 0.8rem 0.7rem -0.5rem ${theme.palette.grey[500]}`,
});

export const ProjectDescription = () => {
  return (
    <DescriptionContainer role='description'>
      {`Heartbeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.`}
    </DescriptionContainer>
  );
};
