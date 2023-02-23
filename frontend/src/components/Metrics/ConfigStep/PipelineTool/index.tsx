import { CircularProgress, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { PIPELINE_TOOL_TYPES, ZERO, INIT_PIPELINE_TOOL_FIELDS_STATE, CONFIG_TITLE } from '@src/constants'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  PipelineToolButtonGroup,
  PipelineToolForm,
  PipelineToolLoadingDrop,
  PipelineToolSection,
  PipelineToolTextField,
  PipelineToolTitle,
  PipelineToolTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/PipelineTool/style'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { changePipelineToolVerifyState, isPipelineToolVerified } from '@src/features/pipelineTool/pipelineToolSlice'
import { selectPipelineToolFields, updatePipelineToolFields } from '@src/features/config/configSlice'
import { verifyBoard } from '@src/services/boardService'

export const PipelineTool = () => {
  const dispatch = useAppDispatch()
  const pipelineToolFields = useAppSelector(selectPipelineToolFields)
  const isVerified = useAppSelector(isPipelineToolVerified)
  const [fieldErrors, setFieldErrors] = useState(INIT_PIPELINE_TOOL_FIELDS_STATE)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const pipelineToolFieldValues = Object.values(pipelineToolFields)
  const pipelineToolFieldNames = Object.keys(pipelineToolFields)
  const pipelineToolFieldStates = Object.values(fieldErrors)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(
      updatePipelineToolFields({
        pipelineTool: pipelineToolFields.pipelineTool,
        token: '',
      })
    )
    setIsDisableVerifyButton(true)
    dispatch(changePipelineToolVerifyState(false))
  }, [pipelineToolFields.pipelineTool, dispatch])

  useEffect(() => {
    setIsDisableVerifyButton(
      !pipelineToolFieldNames
        .map((fieldName, index) => checkFieldValid(pipelineToolFieldValues[index]))
        .every((validField) => validField)
    )
  }, [pipelineToolFields, pipelineToolFieldNames, pipelineToolFieldValues])

  const initPipeLineFields = () => {
    dispatch(
      updatePipelineToolFields({
        pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
        token: '',
      })
    )
  }

  const checkFieldValid = (value: string): boolean => value !== ''

  const onFormUpdate = (key: string, value: string) => {
    const isError = !checkFieldValid(value)
    const newFieldErrors = {
      ...fieldErrors,
      [key]: {
        isError,
        helpText: isError ? ` ${key} is required` : '',
      },
    }
    setFieldErrors(newFieldErrors)
    dispatch(
      updatePipelineToolFields({
        ...pipelineToolFields,
        [key]: value,
      })
    )
  }

  useEffect(() => {
    ;(async () => {
      const response = await verifyBoard()
      if (response.status === 200) {
        setIsLoading(false)
      }
    })()
  }, [isLoading])
  const handleSubmitPipelineToolFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(changePipelineToolVerifyState(true))
    setIsLoading(true)
    alert('Verified failed')
  }

  const handleResetBPipelineToolFields = () => {
    initPipeLineFields()
    setIsDisableVerifyButton(true)
    dispatch(changePipelineToolVerifyState(false))
  }

  return (
    <PipelineToolSection>
      {isLoading && (
        <PipelineToolLoadingDrop open={isLoading} data-testid='circularProgress'>
          <CircularProgress size='8rem' />
        </PipelineToolLoadingDrop>
      )}
      <PipelineToolTitle>{CONFIG_TITLE.PIPELINE_TOOL}</PipelineToolTitle>
      <PipelineToolForm onSubmit={(e) => handleSubmitPipelineToolFields(e)} onReset={handleResetBPipelineToolFields}>
        {pipelineToolFieldNames.map((filedName, index) =>
          index === ZERO ? (
            <PipelineToolTypeSelections variant='standard' required key={pipelineToolFieldValues[index]}>
              <InputLabel id='pipelineTool-type-checkbox-label'>pipelineTool</InputLabel>
              <Select
                labelId='pipelineTool-type-checkbox-label'
                value={pipelineToolFields.pipelineTool}
                onChange={(e) => {
                  onFormUpdate('pipelineTool', e.target.value)
                }}
              >
                {Object.values(PIPELINE_TOOL_TYPES).map((data) => (
                  <MenuItem key={data} value={data}>
                    <ListItemText primary={data} />
                  </MenuItem>
                ))}
              </Select>
            </PipelineToolTypeSelections>
          ) : (
            <PipelineToolTextField
              key={index}
              required
              label={pipelineToolFieldNames[index]}
              variant='standard'
              type='password'
              value={pipelineToolFieldValues[index]}
              onChange={(e) => {
                onFormUpdate(filedName, e.target.value)
              }}
              error={pipelineToolFieldStates[index].isError}
              helperText={pipelineToolFieldStates[index].helpText}
            />
          )
        )}
        <PipelineToolButtonGroup>
          <VerifyButton type='submit' disabled={isDisableVerifyButton}>
            {isVerified ? 'Verified' : 'Verify'}
          </VerifyButton>
          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </PipelineToolButtonGroup>
      </PipelineToolForm>
    </PipelineToolSection>
  )
}
