import { CircularProgress, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_TYPES, emailRegExp, ZERO, INIT_BOARD_FIELDS_STATE, EMAIL } from '@src/constants'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardLoadingDrop,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/metrics/ConfigStep/Board/style'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { changeBoardVerifyState, isBoardVerified } from '@src/features/board/boardSlice'

export const Board = () => {
  const dispatch = useAppDispatch()
  const isVerified = useAppSelector(isBoardVerified)
  const [boardField, setBoardField] = useState(INIT_BOARD_FIELDS_STATE)
  const [isAbleVerifyButton, setIsAbleVerifyButton] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const fields = Object.values(boardField)
  const boardFieldNames = Object.keys(boardField)

  const checkFiledValid = (type: string, value: string): boolean =>
    type === EMAIL ? emailRegExp.test(value) : value !== ''

  const onFormUpdate = (key: string, value: string) => {
    const isError = !checkFiledValid(key, value)
    const newBoardFieldsState = {
      ...boardField,
      [key]: {
        value,
        isError,
        helpText: isError ? ` ${key} is required` : '',
      },
    }
    setIsAbleVerifyButton(
      !boardFieldNames
        .map((fieldName, index) => checkFiledValid(fieldName, fields[index].value))
        .every((validField) => validField)
    )
    setBoardField(newBoardFieldsState)
  }

  const handleSubmitBoardFields = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    dispatch(changeBoardVerifyState(true))
    setIsLoading(!isLoading)
  }

  const handleResetBoardFields = () => {
    setBoardField(INIT_BOARD_FIELDS_STATE)
    setIsAbleVerifyButton(true)
    dispatch(changeBoardVerifyState(false))
  }

  useEffect(() => {
    setBoardField({
      ...boardField,
      boardId: INIT_BOARD_FIELDS_STATE.boardId,
      email: INIT_BOARD_FIELDS_STATE.email,
      projectKey: INIT_BOARD_FIELDS_STATE.projectKey,
      site: INIT_BOARD_FIELDS_STATE.site,
      token: INIT_BOARD_FIELDS_STATE.token,
    })
  }, [boardField.board])

  return (
    <BoardSection>
      {isLoading && (
        <BoardLoadingDrop open={isLoading}>
          <CircularProgress size='8rem' />
        </BoardLoadingDrop>
      )}
      <BoardTitle>board</BoardTitle>
      <BoardForm onSubmit={(e) => handleSubmitBoardFields(e)} onReset={handleResetBoardFields}>
        {boardFieldNames.map((filedTitle, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={fields[index].value}>
              <InputLabel id='board-type-checkbox-label'>board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={boardField.board.value}
                onChange={(e) => {
                  onFormUpdate('board', e.target.value)
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
              key={index}
              required
              label={filedTitle}
              variant='standard'
              value={fields[index].value}
              onChange={(e) => {
                onFormUpdate(filedTitle, e.target.value)
              }}
              error={fields[index].isError}
              helperText={fields[index].helpText}
            />
          )
        )}
        <BoardButtonGroup>
          <VerifyButton type='submit' disabled={isAbleVerifyButton}>
            {isVerified ? 'Verified' : 'Verify'}
          </VerifyButton>
          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
