import {
  ConfigSectionContainer,
  StyledButtonGroup,
  StyledForm,
  StyledTextField,
  StyledTypeSelections,
} from '@src/components/Common/ConfigForms';
import {
  selectDateRange,
  selectIsBoardVerified,
  updateBoard,
  updateBoardVerifyState,
} from '@src/context/config/configSlice';
import { updateTreatFlagCardAsBlock } from '@src/context/Metrics/metricsSlice';
import { ResetButton, VerifyButton } from '@src/components/Common/Buttons';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect';
import { BOARD_TYPES, CONFIG_TITLE } from '@src/constants/resources';
import { FormEvent, useEffect, useState } from 'react';
import { Loading } from '@src/components/Loading';
import dayjs from 'dayjs';

export const Board = () => {
  const dispatch = useAppDispatch();
  const isVerified = useAppSelector(selectIsBoardVerified);
  const DateRange = useAppSelector(selectDateRange);
  const {
    verifyJira,
    isLoading: verifyLoading,
    formFields: fields,
    updateField,
    resetFormFields,
  } = useVerifyBoardEffect();
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(
    !fields.every((field) => field.value && field.isValid),
  );

  const initBoardFields = () => {
    resetFormFields();
    dispatch(updateBoardVerifyState(false));
  };

  useEffect(() => {
    const invalidFields = fields.filter(({ value, isRequired, isValid }) => !value || !isRequired || !isValid);
    setIsDisableVerifyButton(!!invalidFields.length);
  }, [fields]);

  const onFormUpdate = (name: string, value: string) => {
    updateField(name, value);
    dispatch(updateBoardVerifyState(false));
  };

  const updateBoardFields = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updateBoard({
        type: fields[0].value,
        boardId: fields[1].value,
        email: fields[2].value,
        site: fields[3].value,
        token: fields[4].value,
      }),
    );
  };

  const handleSubmitBoardFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateTreatFlagCardAsBlock(true));
    const params = {
      type: fields[0].value,
      boardId: fields[1].value,
      email: fields[2].value,
      site: fields[3].value,
      token: fields[4].value,
    };
    await verifyJira({
      ...params,
      startTime: dayjs(DateRange.startDate).valueOf(),
      endTime: dayjs(DateRange.endDate).valueOf(),
    }).then((res) => {
      if (res?.response) {
        dispatch(updateBoardVerifyState(true));
        dispatch(updateBoard({ ...params, projectKey: res.response.projectKey }));
      }
    });
  };

  const handleResetBoardFields = () => {
    initBoardFields();
    setIsDisableVerifyButton(true);
    dispatch(updateBoardVerifyState(false));
  };

  return (
    <ConfigSectionContainer aria-label='Board Config'>
      {verifyLoading && <Loading />}
      <ConfigSelectionTitle>{CONFIG_TITLE.BOARD}</ConfigSelectionTitle>
      <StyledForm
        onSubmit={(e) => handleSubmitBoardFields(e)}
        onChange={(e) => updateBoardFields(e)}
        onReset={handleResetBoardFields}
      >
        {fields.map((field, index) =>
          !index ? (
            <StyledTypeSelections variant='standard' required key={index}>
              <InputLabel id='board-type-checkbox-label'>Board</InputLabel>
              <Select
                name={field.name}
                labelId='board-type-checkbox-label'
                value={field.value}
                onChange={({ target: { name, value } }) => {
                  onFormUpdate(name, value);
                }}
              >
                {Object.values(BOARD_TYPES).map((data) => (
                  <MenuItem key={data} value={data}>
                    <ListItemText primary={data} />
                  </MenuItem>
                ))}
              </Select>
            </StyledTypeSelections>
          ) : (
            <StyledTextField
              data-testid={field.key}
              name={field.name}
              key={index}
              required
              label={field.key}
              variant='standard'
              value={field.value}
              onChange={({ target: { name, value } }) => {
                onFormUpdate(name, value);
              }}
              error={!field.isRequired || !field.isValid}
              type={field.key === 'Token' ? 'password' : 'text'}
              helperText={field.errorMessage}
              sx={{ gridColumn: `span ${field.col}` }}
            />
          ),
        )}
        <StyledButtonGroup>
          {isVerified && !verifyLoading ? (
            <VerifyButton disabled>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || verifyLoading}>
              Verify
            </VerifyButton>
          )}

          {isVerified && !verifyLoading && <ResetButton type='reset'>Reset</ResetButton>}
        </StyledButtonGroup>
      </StyledForm>
    </ConfigSectionContainer>
  );
};
