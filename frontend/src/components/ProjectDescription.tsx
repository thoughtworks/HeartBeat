import styled from '@emotion/styled';
import theme from '@src/theme';

const DescriptionContainer = styled.p({
  padding: '1rem',
  marginTop: '0',
  boxShadow: `0px 9px 8px -5px ${theme.palette.grey[500]}`,
});

const ProjectDescription = () => {
  return (
    <DescriptionContainer>
      {`HeartBeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.`}
    </DescriptionContainer>
  );
};
export default ProjectDescription;
