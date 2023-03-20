import { FormEvent, useState } from 'react'
import {
  CONFIG_TITLE,
  DEFAULT_HELPER_TEXT,
  EMPTY_STRING,
  GITHUB_TOKEN_REGEXP,
  SOURCE_CONTROL_TYPES,
  TOKEN_HELPER_TEXT,
} from '@src/constants'
import {
  SourceControlButtonGroup,
  SourceControlForm,
  SourceControlSection,
  SourceControlTextField,
  SourceControlTitle,
  SourceControlTypeSelections,
} from '@src/components/Metrics/ConfigStep/SourceControl/style'
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import {
  isSourceControlVerified,
  selectDateRange,
  selectSourceControl,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { useVerifySourceControlEffect } from '@src/hooks/useVeritySourceControlEffect'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { updateSourceControlVerifyResponse } from '@src/context/config/sourceControl/sourceControlVerifyResponse/sourceControlVerifyResponseSlice'
import { Loading } from '@src/components/Loading'
import { VerifyButton, ResetButton } from '@src/components/Common/Buttons'

export const SourceControl = () => {
  const dispatch = useAppDispatch()
  const sourceControlFields = useAppSelector(selectSourceControl)
  const DateRange = useAppSelector(selectDateRange)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const isVerified = useAppSelector(isSourceControlVerified)
  const { verifyGithub, isLoading, errorMessage } = useVerifySourceControlEffect()
  const [fields, setFields] = useState([
    {
      key: 'SourceControl',
      value: sourceControlFields.sourceControl,
      isValid: true,
    },
    {
      key: 'Token',
      value: sourceControlFields.token,
      isValid: true,
    },
  ])
  const [sourceControlHelperText, setSourceControlHelperText] = useState('')

  const initSourceControlFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = index === 1 ? '' : SOURCE_CONTROL_TYPES.GITHUB
      return field
    })
    setFields(newFields)
    dispatch(updateSourceControlVerifyState(false))
  }

  const handleSubmitSourceControlFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      updateSourceControl({
        sourceControl: fields[0].value,
        token: fields[1].value,
      })
    )
    const params = {
      type: fields[0].value,
      token: fields[1].value,
      startTime: DateRange.startDate,
      endTime: DateRange.endDate,
    }
    await verifyGithub(params).then((res) => {
      if (res) {
        dispatch(updateSourceControlVerifyState(res.isSourceControlVerify))
        dispatch(updateSourceControlVerifyResponse(res.response))
      }
    })
  }

  const handleResetSourceControlFields = () => {
    initSourceControlFields()
    setIsDisableVerifyButton(true)
    dispatch(updateSourceControlVerifyState(false))
  }

  const checkFieldValid = (value: string): boolean => {
    let helperText = DEFAULT_HELPER_TEXT

    if (value === EMPTY_STRING) {
      helperText = TOKEN_HELPER_TEXT.RequiredTokenText
    } else if (!GITHUB_TOKEN_REGEXP.test(value)) {
      helperText = TOKEN_HELPER_TEXT.InvalidTokenText
    }
    setSourceControlHelperText(helperText)
    return helperText === DEFAULT_HELPER_TEXT
  }

  const onFormUpdate = (index: number, value: string) => {
    const newFieldsValue = fields.map((field, fieldIndex) => {
      if (fieldIndex === index) {
        field.value = value
        field.isValid = checkFieldValid(value)
      }
      return field
    })
    setIsDisableVerifyButton(!newFieldsValue.every((field) => field.isValid && field.value != ''))
    setFields(newFieldsValue)
  }

  return (
    <SourceControlSection>
      {errorMessage && <ErrorNotification message={errorMessage} />}
      {isLoading && <Loading />}
      <SourceControlTitle>{CONFIG_TITLE.SOURCE_CONTROL}</SourceControlTitle>
      <SourceControlForm onSubmit={(e) => handleSubmitSourceControlFields(e)} onReset={handleResetSourceControlFields}>
        <SourceControlTypeSelections variant='standard' required>
          <InputLabel id='sourceControl-type-checkbox-label'>Source Control</InputLabel>
          <Select labelId='sourceControl-type-checkbox-label' value={fields[0].value}>
            {Object.values(SOURCE_CONTROL_TYPES).map((toolType) => (
              <MenuItem key={toolType} value={toolType}>
                <ListItemText primary={toolType} />
              </MenuItem>
            ))}
          </Select>
        </SourceControlTypeSelections>
        <SourceControlTextField
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
        <SourceControlButtonGroup>
          {isVerified && !isLoading ? (
            <>
              <VerifyButton>Verified</VerifyButton>
              <ResetButton type='reset'>Reset</ResetButton>
            </>
          ) : (
            <VerifyButton
              data-test-id='sourceControlVerifyButton'
              type='submit'
              disabled={isDisableVerifyButton || isLoading}
            >
              Verify
            </VerifyButton>
          )}
        </SourceControlButtonGroup>
      </SourceControlForm>
    </SourceControlSection>
  )
}
