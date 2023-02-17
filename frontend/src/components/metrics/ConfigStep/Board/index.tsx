import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_TYPES, emailRegExp, ZERO, INIT_BOARD_FIELDS_STATE, EMAIL } from '@src/constants'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/metrics/ConfigStep/Board/style'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { changeBoardVerifyState, isBoardVerified } from '@src/features/board/boardSlice'
import { selectBoardFields, updateBoardFields } from '@src/features/config/configSlice'
import { verifyBoard } from '@src/service/config.service'

export const Board = () => {
  const dispatch = useAppDispatch()
  const boardFields = useAppSelector(selectBoardFields)
  const isVerified = useAppSelector(isBoardVerified)
  const [fieldErrors, setFieldErrors] = useState(INIT_BOARD_FIELDS_STATE)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const boardFieldValues = Object.values(boardFields)
  const boardFieldNames = Object.keys(boardFields)
  const boardFieldStates = Object.values(fieldErrors)

  useEffect(() => {
    dispatch(
      updateBoardFields({
        board: boardFields.board,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
  }, [boardFields.board])

  useEffect(() => {
    setIsDisableVerifyButton(
      !boardFieldNames
        .map((fieldName, index) => checkFiledValid(fieldName, boardFieldValues[index]))
        .every((validField) => validField)
    )
  }, [boardFields])

  const initBoardFields = () => {
    dispatch(
      updateBoardFields({
        board: BOARD_TYPES.JIRA,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
  }

  const checkFiledValid = (type: string, value: string): boolean =>
    type === EMAIL ? emailRegExp.test(value) : value !== ''

  const onFormUpdate = (key: string, value: string) => {
    const isError = !checkFiledValid(key, value)
    const newFieldErrors = {
      ...fieldErrors,
      [key]: {
        isError,
        helpText: isError ? ` ${key} is required` : '',
      },
    }
    setFieldErrors(newFieldErrors)
    dispatch(
      updateBoardFields({
        ...boardFields,
        [key]: value,
      })
    )
  }

  const handleSubmitBoardFields = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    dispatch(changeBoardVerifyState(true))
    await verifyBoard()
  }

  const handleResetBoardFields = () => {
    initBoardFields()
    setIsDisableVerifyButton(true)
    dispatch(changeBoardVerifyState(false))
  }

  return (
    <BoardSection>
      <BoardTitle>Board</BoardTitle>
      <BoardForm onSubmit={(e) => handleSubmitBoardFields(e)} onReset={handleResetBoardFields}>
        {boardFieldNames.map((filedName, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={boardFieldValues[index]}>
              <InputLabel id='board-type-checkbox-label'>board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={boardFields.board}
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
              label={boardFieldNames[index]}
              variant='standard'
              value={boardFieldValues[index]}
              onChange={(e) => {
                onFormUpdate(filedName, e.target.value)
              }}
              error={boardFieldStates[index].isError}
              helperText={boardFieldStates[index].helpText}
            />
          )
        )}
        <BoardButtonGroup>
          <VerifyButton type='submit' disabled={isDisableVerifyButton}>
            {isVerified ? 'Verified' : 'Verify'}
          </VerifyButton>
          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
