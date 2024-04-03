import {
  StyledContainer,
  StyledTitle,
  TooltipContainer,
  StyledTooltip,
} from '@src/components/Common/SectionTitleWithTooltip/style';
import { IProps } from '@src/components/Common/SectionTitleWithTooltip/types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';

const SectionTitleWithTooltip = ({ title, tooltipText, titleStyle }: IProps) => (
  <StyledContainer>
    <StyledTitle style={titleStyle} title={title} />
    <TooltipContainer aria-label='tooltip' data-test-id={'tooltip'}>
      <StyledTooltip arrow title={tooltipText}>
        <IconButton aria-label='info'>
          <InfoOutlinedIcon />
        </IconButton>
      </StyledTooltip>
    </TooltipContainer>
  </StyledContainer>
);

export default SectionTitleWithTooltip;
