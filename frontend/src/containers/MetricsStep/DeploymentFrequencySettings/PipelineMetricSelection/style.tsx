import { BasicButton } from '@src/components/Common/Buttons';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const PipelineMetricSelectionWrapper = styled('div')`
  position: relative;
  width: 100%;
  padding: 1.5rem 0 0.5rem 0;
  border: ${theme.main.cardBorder};
  box-shadow: none;
  margin-bottom: 1rem;
  line-height: '2rem';
  boarder-radius: 0.25rem;
`;

export const ButtonWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
});

export const RemoveButton = styled(BasicButton)({
  fontFamily: theme.main.font.secondary,
  marginRight: '2rem',
});

export const WarningMessage = styled('p')({
  fontFamily: theme.typography.fontFamily,
  color: theme.components?.errorMessage.color,
  margin: '0 0 0 2.5%',
  width: '95%',
});

export const BranchSelectionWrapper = styled('div')({
  margin: '0 0 1.5rem 2.5%',
  width: '95%',
});
