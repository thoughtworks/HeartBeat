import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_FIELDS, BOARD_TYPES, emailRegExp, ZERO, INIT_BOARD_FIELDS_STATE, EMAIL } from '@src/constants'
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

export const Board = () => {
  const [boardField, setBoardField] = useState(INIT_BOARD_FIELDS_STATE)
  const [isShowResetButton, setIsShowResetButton] = useState(false)
  const [isAbleVerifyButton, setIsAbleVerifyButton] = useState(true)
  const fields = Object.values(boardField)

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
      !(
        newBoardFieldsState.boardId.value !== '' &&
        newBoardFieldsState.site.value !== '' &&
        newBoardFieldsState.token.value !== '' &&
        newBoardFieldsState.projectKey.value !== '' &&
        emailRegExp.test(newBoardFieldsState.email.value) &&
        !newBoardFieldsState.boardId.isError &&
        !newBoardFieldsState.email.isError &&
        !newBoardFieldsState.site.isError &&
        !newBoardFieldsState.token.isError &&
        !newBoardFieldsState.projectKey.isError
      )
    )
    setBoardField(newBoardFieldsState)
  }

  const handleSubmitBoardFields = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsShowResetButton(true)
  }
  const handleResetClick = () => {
    setBoardField(INIT_BOARD_FIELDS_STATE)
    setIsShowResetButton(false)
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
      <BoardTitle>board</BoardTitle>
      <BoardForm onSubmit={(e) => handleSubmitBoardFields(e)}>
        {BOARD_FIELDS.map((filedTitle, index) =>
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
            Verify
          </VerifyButton>
          {isShowResetButton && <ResetButton onClick={handleResetClick}>Reset</ResetButton>}
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
