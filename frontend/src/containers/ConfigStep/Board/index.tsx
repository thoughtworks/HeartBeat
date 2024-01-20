import {
  selectBoard,
  selectDateRange,
  selectIsBoardVerified,
  selectIsProjectCreated,
  updateBoard,
  updateBoardVerifyState,
  updateJiraVerifyResponse,
} from '@src/context/config/configSlice';
import {
  ConfigSectionContainer,
  StyledButtonGroup,
  StyledForm,
  StyledTextField,
  StyledTypeSelections,
} from '@src/components/Common/ConfigForms';
import { updateMetricsState, updateTreatFlagCardAsBlock } from '@src/context/Metrics/metricsSlice';
import { BOARD_TYPES, CONFIG_TITLE, EMAIL, BOARD_TOKEN } from '@src/constants/resources';
import { ResetButton, VerifyButton } from '@src/components/Common/Buttons';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { DEFAULT_HELPER_TEXT, EMPTY_STRING } from '@src/constants/commons';
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect';
import { ErrorNotification } from '@src/components/ErrorNotification';
import { NoCardPop } from '@src/containers/ConfigStep/NoDoneCardPop';
import { findCaseInsensitiveType } from '@src/utils/util';
import { FormEvent, useEffect, useState } from 'react';
import { Loading } from '@src/components/Loading';
import { REGEX } from '@src/constants/regex';
import dayjs from 'dayjs';

export const Board = () => {
  const dispatch = useAppDispatch();
  const isVerified = useAppSelector(selectIsBoardVerified);
  const boardFields = useAppSelector(selectBoard);
  const DateRange = useAppSelector(selectDateRange);
  const isProjectCreated = useAppSelector(selectIsProjectCreated);
  const [isShowNoDoneCard, setIsNoDoneCard] = useState(false);
  const { verifyJira, isLoading, errorMessage } = useVerifyBoardEffect();
  const type = findCaseInsensitiveType(Object.values(BOARD_TYPES), boardFields.type);
  const [fields, setFields] = useState([
    {
      key: 'Board',
      value: type,
      isRequired: true,
      isValid: true,
    },
    {
      key: 'Board Id',
      value: boardFields.boardId,
      isRequired: true,
      isValid: true,
    },
    {
      key: 'Email',
      value: boardFields.email,
      isRequired: true,
      isValid: true,
    },
    {
      key: 'Project Key',
      value: boardFields.projectKey,
      isRequired: true,
      isValid: true,
    },
    {
      key: 'Site',
      value: boardFields.site,
      isRequired: true,
      isValid: true,
    },
    {
      key: 'Token',
      value: boardFields.token,
      isRequired: true,
      isValid: true,
    },
  ]);
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(
    !fields.every((field) => field.value && field.isValid),
  );

  const initBoardFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = !index ? BOARD_TYPES.JIRA : EMPTY_STRING;
      return field;
    });
    setFields(newFields);
    dispatch(updateBoardVerifyState(false));
  };

  const updateFields = (
    fields: { key: string; value: string; isRequired: boolean; isValid: boolean }[],
    index: number,
    value: string,
  ) => {
    return fields.map((field, fieldIndex) => {
      if (fieldIndex !== index) {
        return field;
      }
      const newValue = value.trim();
      const isValueEmpty = !!newValue;
      const isValueValid =
        field.key === EMAIL
          ? REGEX.EMAIL.test(newValue)
          : field.key === BOARD_TOKEN
            ? REGEX.BOARD_TOKEN.test(newValue)
            : true;
      return {
        ...field,
        value: newValue,
        isRequired: isValueEmpty,
        isValid: isValueValid,
      };
    });
  };

  useEffect(() => {
    const isFieldInvalid = (field: { key: string; value: string; isRequired: boolean; isValid: boolean }) =>
      field.isRequired && field.isValid && !!field.value;

    const isAllFieldsValid = (fields: { key: string; value: string; isRequired: boolean; isValid: boolean }[]) =>
      fields.some((field) => !isFieldInvalid(field));
    setIsDisableVerifyButton(isAllFieldsValid(fields));
  }, [fields]);

  const onFormUpdate = (index: number, value: string) => {
    const newFieldsValue = !index
      ? updateFields(fields, index, value).map((field, index) => {
          return {
            ...field,
            value: !index ? value : EMPTY_STRING,
            isValid: true,
            isRequired: true,
          };
        })
      : updateFields(fields, index, value);
    setFields(newFieldsValue);
    dispatch(updateBoardVerifyState(false));
  };

  const updateBoardFields = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updateBoard({
        type: fields[0].value,
        boardId: fields[1].value,
        email: fields[2].value,
        projectKey: fields[3].value,
        site: fields[4].value,
        token: fields[5].value,
      }),
    );
  };

  const handleSubmitBoardFields = async (e: FormEvent<HTMLFormElement>) => {
    dispatch(updateTreatFlagCardAsBlock(true));
    updateBoardFields(e);
    const msg = `${fields[2].value}:${fields[5].value}`;
    const encodeToken = `Basic ${btoa(msg)}`;
    const params = {
      type: fields[0].value,
      boardId: fields[1].value,
      projectKey: fields[3].value,
      site: fields[4].value,
      token: encodeToken,
      startTime: dayjs(DateRange.startDate).valueOf(),
      endTime: dayjs(DateRange.endDate).valueOf(),
    };
    await verifyJira(params).then((res) => {
      if (res) {
        dispatch(updateBoardVerifyState(res.isBoardVerify));
        dispatch(updateJiraVerifyResponse(res.response));
        res.isBoardVerify && dispatch(updateMetricsState({ ...res.response, isProjectCreated }));
        setIsNoDoneCard(!res.haveDoneCard);
      }
    });
  };

  const handleResetBoardFields = () => {
    initBoardFields();
    setIsDisableVerifyButton(true);
    dispatch(updateBoardVerifyState(false));
  };

  const updateFieldHelpText = (field: { key: string; isRequired: boolean; isValid: boolean }) => {
    const { key, isRequired, isValid } = field;
    if (!isRequired) {
      return `${key} is required`;
    }
    if ((key === EMAIL || key === BOARD_TOKEN) && !isValid) {
      return `${key} is invalid`;
    }
    return DEFAULT_HELPER_TEXT;
  };

  return (
    <ConfigSectionContainer aria-label='Board Config'>
      <NoCardPop isOpen={isShowNoDoneCard} onClose={() => setIsNoDoneCard(false)} />
      {errorMessage && <ErrorNotification message={errorMessage} />}
      {isLoading && <Loading />}
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
                labelId='board-type-checkbox-label'
                value={field.value}
                onChange={(e) => {
                  onFormUpdate(index, e.target.value);
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
              key={index}
              required
              label={field.key}
              variant='standard'
              value={field.value}
              onChange={(e) => {
                onFormUpdate(index, e.target.value);
              }}
              error={!field.isRequired || !field.isValid}
              type={field.key === 'Token' ? 'password' : 'text'}
              helperText={updateFieldHelpText(field)}
            />
          ),
        )}
        <StyledButtonGroup>
          {isVerified && !isLoading ? (
            <VerifyButton disabled>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || isLoading}>
              Verify
            </VerifyButton>
          )}

          {isVerified && !isLoading && <ResetButton type='reset'>Reset</ResetButton>}
        </StyledButtonGroup>
      </StyledForm>
    </ConfigSectionContainer>
  );
};
