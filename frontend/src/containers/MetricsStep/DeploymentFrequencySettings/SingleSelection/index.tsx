import { getEmojiUrls, removeExtraEmojiName } from '@src/constants/emojis/emoji';
import { Autocomplete, Box, ListItemText, TextField } from '@mui/material';
import { EmojiWrap, StyledAvatar } from '@src/constants/emojis/style';
import { Z_INDEX } from '@src/constants/commons';
import { FormControlWrapper } from './style';
import React, { useState } from 'react';

interface Props {
  options: string[];
  label: string;
  value: string;
  id: number;
  onGetSteps?: (pipelineName: string) => void;
  onUpDatePipeline: (id: number, label: string, value: string) => void;
}

export const SingleSelection = ({ options, label, value, id, onGetSteps, onUpDatePipeline }: Props) => {
  const labelId = `single-selection-${label.toLowerCase().replace(' ', '-')}`;
  const [inputValue, setInputValue] = useState<string>(value);

  const handleSelectedOptionsChange = (value: string) => {
    if (onGetSteps) {
      onUpDatePipeline(id, 'Step', '');
      onGetSteps(value);
    }
    onUpDatePipeline(id, label, value);
  };

  const emojiView = (pipelineStepName: string) => {
    const emojiUrls: string[] = getEmojiUrls(pipelineStepName);
    return emojiUrls.map((url) => <StyledAvatar key={url} src={url} />);
  };

  return (
    <>
      <FormControlWrapper variant='standard' required>
        <Autocomplete
          disableClearable
          data-test-id={labelId}
          options={options}
          getOptionLabel={(option: string) => removeExtraEmojiName(option).trim()}
          renderOption={(props, option: string) => (
            <Box component='li' {...props}>
              <EmojiWrap>
                {emojiView(option)}
                <ListItemText primary={removeExtraEmojiName(option)} data-test-id={'single-option'} />
              </EmojiWrap>
            </Box>
          )}
          value={value}
          onChange={(event, newValue: string) => {
            handleSelectedOptionsChange(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => <TextField required {...params} label={label} variant='standard' />}
          slotProps={{
            popper: {
              sx: {
                zIndex: Z_INDEX.DROPDOWN,
              },
            },
          }}
        />
      </FormControlWrapper>
    </>
  );
};
