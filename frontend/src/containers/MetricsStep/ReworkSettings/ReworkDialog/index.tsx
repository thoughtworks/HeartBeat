import {
  StyledDialogContent,
  StyledDialogContainer,
  StyledStepOfRework,
  StyledDialogTitle,
  StyledStepper,
  StyledNote,
  StyledNoteTitle,
  StyledNoteText,
  StyledSelectedImg,
  StyledJiraImg,
  StyledButtonGroup,
  StyledStepButton,
  StyledStepLabel,
} from '@src/containers/MetricsStep/ReworkSettings/ReworkDialog/style';
import { REWORK_DIALOG_NOTE, REWORK_STEPS, REWORK_STEPS_NAME } from '@src/constants/resources';
import ReworkSelectedWaitingForTest from '@src/assets/ReworkSelectedWaitingForTest.svg';
import ReworkSelectedInDev from '@src/assets/ReworkSelectedInDev.svg';
import { StyledStep } from '@src/containers/MetricsStepper/style';
import StepOfExcludeJira from '@src/assets/StepOfExcludeJira.svg';
import StepOfReworkJira from '@src/assets/StepOfReworkJira.svg';
import { COMMON_BUTTONS } from '@src/constants/commons';
import CloseIcon from '@mui/icons-material/Close';
import React, { Suspense, useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog } from '@mui/material';

export const ReworkDialog = (props: { isShowDialog: boolean; hiddenDialog: () => void }): JSX.Element => {
  const [activeStep, setActiveStep] = useState(REWORK_STEPS.REWORK_TO_WHICH_STATE);
  const { isShowDialog, hiddenDialog } = props;

  const handleStep = () => {
    if (activeStep === REWORK_STEPS.REWORK_TO_WHICH_STATE) {
      setActiveStep(REWORK_STEPS.EXCLUDE_WHICH_STATES);
    } else {
      setActiveStep(REWORK_STEPS.REWORK_TO_WHICH_STATE);
    }
  };

  const renderContent = (selectedImg: string, jiraImg: string, explanationText: string, noteText: string) => {
    return (
      <StyledStepOfRework>
        <StyledSelectedImg src={selectedImg} alt='selected' />
        <StyledJiraImg src={jiraImg} alt='jira' />
        <StyledNote>
          <StyledNoteTitle>Explanation: </StyledNoteTitle>
          <StyledNoteText>{explanationText}</StyledNoteText>
        </StyledNote>
        <StyledNote>
          <StyledNoteTitle>Note: </StyledNoteTitle>
          <StyledNoteText>{noteText}</StyledNoteText>
        </StyledNote>
      </StyledStepOfRework>
    );
  };

  return (
    <Dialog open={isShowDialog} maxWidth={'md'}>
      <StyledDialogContainer>
        <StyledDialogTitle>
          <p>How to setup? </p>
          <CloseIcon onClick={hiddenDialog} />
        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledStepper activeStep={activeStep}>
            {REWORK_STEPS_NAME.map((label, index) => (
              <StyledStep
                key={label}
                completed={false}
                active={activeStep === index || activeStep === REWORK_STEPS.EXCLUDE_WHICH_STATES}
              >
                <StyledStepLabel>{label}</StyledStepLabel>
              </StyledStep>
            ))}
          </StyledStepper>
          <Suspense>
            {activeStep === REWORK_STEPS.REWORK_TO_WHICH_STATE &&
              renderContent(
                ReworkSelectedInDev,
                StepOfReworkJira,
                REWORK_DIALOG_NOTE.REWORK_EXPLANATION,
                REWORK_DIALOG_NOTE.REWORK_NOTE,
              )}
            {activeStep === REWORK_STEPS.EXCLUDE_WHICH_STATES &&
              renderContent(
                ReworkSelectedWaitingForTest,
                StepOfExcludeJira,
                REWORK_DIALOG_NOTE.EXCLUDE_EXPLANATION,
                REWORK_DIALOG_NOTE.EXCLUDE_NOTE,
              )}
          </Suspense>
        </StyledDialogContent>
        <StyledButtonGroup>
          <StyledStepButton variant='outlined' onClick={handleStep}>
            {activeStep === REWORK_STEPS.REWORK_TO_WHICH_STATE ? COMMON_BUTTONS.NEXT : COMMON_BUTTONS.BACK}
          </StyledStepButton>
          <Button variant='contained' onClick={hiddenDialog}>
            {COMMON_BUTTONS.CONFIRM}
          </Button>
        </StyledButtonGroup>
      </StyledDialogContainer>
    </Dialog>
  );
};
