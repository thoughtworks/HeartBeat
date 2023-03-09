import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_TYPES, emailRegExp, ZERO, EMAIL, CONFIG_TITLE, BOARD_TOKEN, BoardTokenRegExp } from '@src/constants'
import React, { FormEvent, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/Board/style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { updateBoardVerifyState, selectIsBoardVerified } from '@src/context/board/boardSlice'
import { selectBoard, selectDateRange, updateBoard } from '@src/context/config/configSlice'
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect'
import { ErrorNotification } from '@src/components/ErrorNotifaction'
import { NoDoneCardPop } from '@src/components/Metrics/ConfigStep/NoDoneCardPop'
import { updateJiraVerifyResponse } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { Loading } from '@src/components/Loading'

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
      key: 'BoardId',
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

  const onFormUpdate = (index: number, value: string) => {
    if (index === ZERO) {
      const newFieldsValue = fields.map((field, index) => {
        if (index !== ZERO) field.value = ''
        return field
      })
      setFields(newFieldsValue)
      dispatch(updateBoardVerifyState(false))
      return
    }
    const newFieldsValue = fields.map((field, fieldIndex) => {
      if (fieldIndex !== index) {
        return field
      }
      field.value = value
      field.isRequired = value !== ''
      if (fields[index].key === EMAIL) {
        field.isValid = emailRegExp.test(value)
      }
      if (fields[index].key === BOARD_TOKEN) {
        field.isValid = BoardTokenRegExp.test(value)
      }
      return field
    })

    setIsDisableVerifyButton(!newFieldsValue.every((field) => field.isRequired && field.value != ''))
    setFields(newFieldsValue)
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
        {fields.map((filed, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={index}>
              <InputLabel id='board-type-checkbox-label'>Board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={filed.value}
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
              data-testid={filed.key}
              key={index}
              required
              label={filed.key}
              variant='standard'
              value={filed.value}
              onChange={(e) => {
                onFormUpdate(index, e.target.value)
              }}
              error={!filed.isRequired || !filed.isValid}
              type={filed.key === 'Token' ? 'password' : 'text'}
              helperText={updateFieldHelpText(filed)}
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
