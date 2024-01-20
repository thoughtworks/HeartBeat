import {
  isSourceControlVerified,
  selectDateRange,
  selectSourceControl,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice';
import {
  ConfigSectionContainer,
  StyledButtonGroup,
  StyledForm,
  StyledTextField,
  StyledTypeSelections,
} from '@src/components/Common/ConfigForms';
import { CONFIG_TITLE, SOURCE_CONTROL_TYPES, TOKEN_HELPER_TEXT } from '@src/constants/resources';
import { useVerifySourceControlEffect } from '@src/hooks/useVeritySourceControlEffect';
import { VerifyButton, ResetButton } from '@src/components/Common/Buttons';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { DEFAULT_HELPER_TEXT, EMPTY_STRING } from '@src/constants/commons';
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { ErrorNotification } from '@src/components/ErrorNotification';
import { findCaseInsensitiveType } from '@src/utils/util';
import { FormEvent, useEffect, useState } from 'react';
import { Loading } from '@src/components/Loading';
import { REGEX } from '@src/constants/regex';

export const SourceControl = () => {
  const dispatch = useAppDispatch();
  const sourceControlFields = useAppSelector(selectSourceControl);
  const DateRange = useAppSelector(selectDateRange);
  const isVerified = useAppSelector(isSourceControlVerified);
  const { verifyGithub, isLoading, errorMessage } = useVerifySourceControlEffect();
  const type = findCaseInsensitiveType(Object.values(SOURCE_CONTROL_TYPES), sourceControlFields.type);
  const [fields, setFields] = useState([
    {
      key: 'SourceControl',
      value: type,
      isValid: true,
      isRequired: true,
    },
    {
      key: 'Token',
      value: sourceControlFields.token,
      isValid: true,
      isRequired: true,
    },
  ]);
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(!(fields[1].isValid && fields[1].value));
  const [sourceControlHelperText, setSourceControlHelperText] = useState('');

  const initSourceControlFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = index === 1 ? '' : SOURCE_CONTROL_TYPES.GITHUB;
      return field;
    });
    setFields(newFields);
    dispatch(updateSourceControlVerifyState(false));
  };

  useEffect(() => {
    const isFieldInvalid = (field: { key: string; value: string; isRequired: boolean; isValid: boolean }) =>
      field.isRequired && field.isValid && !!field.value;

    const isAllFieldsValid = (fields: { key: string; value: string; isRequired: boolean; isValid: boolean }[]) =>
      fields.some((field) => !isFieldInvalid(field));
    setIsDisableVerifyButton(isAllFieldsValid(fields));
  }, [fields]);

  const updateSourceControlFields = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updateSourceControl({
        type: fields[0].value,
        token: fields[1].value,
      }),
    );
  };

  const handleSubmitSourceControlFields = async (e: FormEvent<HTMLFormElement>) => {
    updateSourceControlFields(e);
    const params = {
      type: fields[0].value,
      token: fields[1].value,
      startTime: DateRange.startDate,
      endTime: DateRange.endDate,
    };
    await verifyGithub(params).then((res) => {
      if (res) {
        dispatch(updateSourceControlVerifyState(res.isSourceControlVerify));
        dispatch(updateSourceControlVerifyState(res.response));
      }
    });
  };

  const handleResetSourceControlFields = () => {
    initSourceControlFields();
    setIsDisableVerifyButton(true);
    dispatch(updateSourceControlVerifyState(false));
  };

  const checkFieldValid = (value: string): boolean => {
    let helperText = DEFAULT_HELPER_TEXT;

    if (value === EMPTY_STRING) {
      helperText = TOKEN_HELPER_TEXT.RequiredTokenText;
    } else if (!REGEX.GITHUB_TOKEN.test(value)) {
      helperText = TOKEN_HELPER_TEXT.InvalidTokenText;
    }
    setSourceControlHelperText(helperText);
    return helperText === DEFAULT_HELPER_TEXT;
  };

  const onFormUpdate = (index: number, value: string) => {
    const newFieldsValue = fields.map((field, fieldIndex) => {
      if (fieldIndex === index) {
        field.value = value;
        field.isValid = checkFieldValid(value);
      }
      return field;
    });
    setFields(newFieldsValue);
    dispatch(updateSourceControlVerifyState(false));
  };

  return (
    <ConfigSectionContainer aria-label='Source Control Config'>
      {errorMessage && <ErrorNotification message={errorMessage} />}
      {isLoading && <Loading />}
      <ConfigSelectionTitle>{CONFIG_TITLE.SOURCE_CONTROL}</ConfigSelectionTitle>
      <StyledForm
        onSubmit={(e) => handleSubmitSourceControlFields(e)}
        onChange={(e) => updateSourceControlFields(e)}
        onReset={handleResetSourceControlFields}
      >
        <StyledTypeSelections variant='standard' required>
          <InputLabel id='sourceControl-type-checkbox-label'>Source Control</InputLabel>
          <Select labelId='sourceControl-type-checkbox-label' value={fields[0].value}>
            {Object.values(SOURCE_CONTROL_TYPES).map((toolType) => (
              <MenuItem key={toolType} value={toolType}>
                <ListItemText primary={toolType} />
              </MenuItem>
            ))}
          </Select>
        </StyledTypeSelections>
        <StyledTextField
          data-testid='sourceControlTextField'
          key={fields[1].key}
          required
          label={fields[1].key}
          variant='standard'
          type='password'
          value={fields[1].value}
          onChange={(e) => onFormUpdate(1, e.target.value)}
          error={!fields[1].isValid}
          helperText={sourceControlHelperText}
        />
        <StyledButtonGroup>
          {isVerified && !isLoading ? (
            <>
              <VerifyButton disabled>Verified</VerifyButton>
              <ResetButton type='reset'>Reset</ResetButton>
            </>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || isLoading}>
              Verify
            </VerifyButton>
          )}
        </StyledButtonGroup>
      </StyledForm>
    </ConfigSectionContainer>
  );
};
