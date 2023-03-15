import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_TYPES, EMAIL_REG_EXP, ZERO, EMAIL, CONFIG_TITLE, BOARD_TOKEN, BOARD_TOKEN_REG_EXP } from '@src/constants'
import React, { FormEvent, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
} from '@src/components/Metrics/ConfigStep/Board/style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { updateBoardVerifyState, selectIsBoardVerified } from '@src/context/board/boardSlice'
import { selectBoard, selectDateRange, updateBoard } from '@src/context/config/configSlice'
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { NoDoneCardPop } from '@src/components/Metrics/ConfigStep/NoDoneCardPop'
import { Loading } from '@src/components/Loading'
import { updateJiraVerifyResponse } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { ResetButton, VerifyButton } from '@src/components/Common/Buttons'

export const Board = () => {
  const dispatch = useAppDispatch()
  const isVerified = useAppSelector(selectIsBoardVerified)
  const boardFields = useAppSelector(selectBoard)
  const DateRange = useAppSelector(selectDateRange)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const [isShowNoDoneCard, setIsNoDoneCard] = useState(false)
  const { verifyJira, isLoading, errorMessage } = useVerifyBoardEffect()
  const [fields, setFields] = useState([
    {
      key: 'Board',
      value: boardFields.type,
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
  ])

  const initBoardFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = index === ZERO ? BOARD_TYPES.JIRA : ''
      return field
    })
    setFields(newFields)
    dispatch(updateBoardVerifyState(false))
  }

  const updateFields = (
    fields: { key: string; value: string; isRequired: boolean; isValid: boolean }[],
    index: number,
    value: string
  ) => {
    return fields.map((field, fieldIndex) => {
      if (fieldIndex !== index) {
        return field
      }
      const newValue = value.trim()
      const isValueEmpty = newValue === ''
      const isValueValid =
        field.key === EMAIL
          ? EMAIL_REG_EXP.test(newValue)
          : field.key === BOARD_TOKEN
          ? BOARD_TOKEN_REG_EXP.test(newValue)
          : true
      return {
        ...field,
        value: newValue,
        isRequired: !isValueEmpty,
        isValid: isValueValid,
      }
    })
  }

  const onFormUpdate = (index: number, value: string) => {
    const newFieldsValue =
      index === ZERO
        ? updateFields(fields, index, value).map((field, index) => {
            return {
              ...field,
              value: index === 0 ? value : '',
              isValid: true,
              isRequired: true,
            }
          })
        : updateFields(fields, index, value)
    setIsDisableVerifyButton(!newFieldsValue.every((field) => field.isRequired && field.isValid && field.value !== ''))
    setFields(newFieldsValue)
    dispatch(updateBoardVerifyState(false))
  }

  const handleSubmitBoardFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      updateBoard({
        board: fields[0].value,
        boardId: fields[1].value,
        email: fields[2].value,
        projectKey: fields[3].value,
        site: fields[4].value,
        token: fields[5].value,
      })
    )
    const msg = `${fields[2].value}:${fields[5].value}`
    const encodeToken = `Basic ${btoa(msg)}`
    const params = {
      type: fields[0].value,
      boardId: fields[1].value,
      projectKey: fields[3].value,
      site: fields[4].value,
      token: encodeToken,
      startTime: DateRange.startDate,
      endTime: DateRange.endDate,
    }
    await verifyJira(params).then((res) => {
      if (res) {
        dispatch(updateBoardVerifyState(res.isBoardVerify))
        dispatch(updateJiraVerifyResponse(res.response))
        setIsNoDoneCard(res.isNoDoneCard)
      }
    })
  }

  const handleResetBoardFields = () => {
    initBoardFields()
    setIsDisableVerifyButton(true)
    dispatch(updateBoardVerifyState(false))
  }

  const updateFieldHelpText = (field: { key: string; isRequired: boolean; isValid: boolean }) => {
    const { key, isRequired, isValid } = field
    if (!isRequired) {
      return `${key} is required`
    }
    if ((key === EMAIL || key === BOARD_TOKEN) && !isValid) {
      return `${key} is invalid`
    }
    return ''
  }

  return (
    <BoardSection>
      <NoDoneCardPop isOpen={isShowNoDoneCard} onClose={() => setIsNoDoneCard(false)} />
      {errorMessage && <ErrorNotification message={errorMessage} />}
      {isLoading && <Loading />}
      <BoardTitle>{CONFIG_TITLE.BOARD}</BoardTitle>
      <BoardForm onSubmit={(e) => handleSubmitBoardFields(e)} onReset={handleResetBoardFields}>
        {fields.map((field, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={index}>
              <InputLabel id='board-type-checkbox-label'>Board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={field.value}
                onChange={(e) => {
                  onFormUpdate(index, e.target.value)
                }}
              >
                {Object.values(BOARD_TYPES).map((data) => (
                  <MenuItem key={data} value={data}>
                    <ListItemText primary={data} />
                  </MenuItem>
                ))}
              </Select>
            </BoardTypeSelections>
          ) : (
            <BoardTextField
              data-testid={field.key}
              key={index}
              required
              label={field.key}
              variant='standard'
              value={field.value}
              onChange={(e) => {
                onFormUpdate(index, e.target.value)
              }}
              error={!field.isRequired || !field.isValid}
              type={field.key === 'Token' ? 'password' : 'text'}
              helperText={updateFieldHelpText(field)}
            />
          )
        )}
        <BoardButtonGroup>
          {isVerified && !isLoading ? (
            <VerifyButton>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || isLoading}>
              Verify
            </VerifyButton>
          )}

          {isVerified && !isLoading && <ResetButton type='reset'>Reset</ResetButton>}
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
