import React, { FormEvent, useState } from 'react'
import { CONFIG_TITLE, SOURCE_CONTROL_TYPES } from '@src/constants'
import {
  ResetButton,
  SourceControlButtonGroup,
  SourceControlForm,
  SourceControlSection,
  SourceControlTextField,
  SourceControlTitle,
  SourceControlTypeSelections,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/SourceControl/style'
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { selectSourceControlFields, updateSourceControlFields } from '@src/features/config/configSlice'
import { changeSourceControlVerifyState, isSourceControlVerified } from '@src/features/sourceControl/sourceControlSlice'

export const SourceControl = () => {
  const dispatch = useAppDispatch()
  const sourceControlFields = useAppSelector(selectSourceControlFields)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const isVerified = useAppSelector(isSourceControlVerified)
  const [fields, setFields] = useState([
    {
      key: 'sourceControl',
      value: sourceControlFields.sourceControl,
      isValid: true,
    },
    {
      key: 'token',
      value: sourceControlFields.token,
      isValid: true,
    },
  ])

  const initSourceControlFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = index === 1 ? '' : SOURCE_CONTROL_TYPES.GIT_HUB
      return field
    })
    setFields(newFields)
    dispatch(changeSourceControlVerifyState(false))
  }

  const handleSubmitSourceControlFields = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      updateSourceControlFields({
        sourceControl: fields[0].value,
        token: fields[1].value,
      })
    )
    dispatch(changeSourceControlVerifyState(true))
  }

  const handleResetSourceControlFields = () => {
    initSourceControlFields()
    setIsDisableVerifyButton(true)
    dispatch(changeSourceControlVerifyState(false))
  }

  const checkFieldValid = (value: string): boolean => value !== ''

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
      <SourceControlTitle>{CONFIG_TITLE.SOURCE_CONTROL}</SourceControlTitle>
      <SourceControlForm onSubmit={(e) => handleSubmitSourceControlFields(e)} onReset={handleResetSourceControlFields}>
        <SourceControlTypeSelections variant='standard' required>
          <InputLabel id='sourceControl-type-checkbox-label'>sourceControl</InputLabel>
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
          helperText={!fields[1].isValid ? 'token is required' : ''}
        />
        <SourceControlButtonGroup>
          <VerifyButton type='submit' disabled={isDisableVerifyButton}>
            {isVerified ? 'Verified' : 'Verify'}
          </VerifyButton>
          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </SourceControlButtonGroup>
      </SourceControlForm>
    </SourceControlSection>
  )
}
