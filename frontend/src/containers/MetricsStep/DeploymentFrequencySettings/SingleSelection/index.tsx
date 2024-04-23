import { selectDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';
import { getEmojiUrls, removeExtraEmojiName } from '@src/constants/emojis/emoji';
import { initSinglePipelineListBranches } from '@src/context/meta/metaSlice';
import { Autocomplete, Box, ListItemText, TextField } from '@mui/material';
import { getDisabledOptions, sortDisabledOptions } from '@src/utils/util';
import { EmojiWrap, StyledAvatar } from '@src/constants/emojis/style';
import { DEFAULT_HELPER_TEXT, Z_INDEX } from '@src/constants/commons';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { FormControlWrapper } from './style';
import { useAppSelector } from '@src/hooks';
import React, { useState } from 'react';

interface Props {
  options: string[];
  label: string;
  value: string;
  id: number;
  isError?: boolean;
  errorText?: string;
  onGetSteps?: (pipelineName: string) => void;
  onUpDatePipeline: (id: number, label: string, value: string | []) => void;
}

export const SingleSelection = ({
  options,
  label,
  value,
  id,
  isError = false,
  errorText,
  onGetSteps,
  onUpDatePipeline,
}: Props) => {
  const labelId = `single-selection-${label.toLowerCase().replace(' ', '-')}`;
  const [inputValue, setInputValue] = useState<string>(value);
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings);
  const dispatch = useAppDispatch();

  const handleSelectedOptionsChange = (value: string) => {
    if (onGetSteps) {
      onUpDatePipeline(id, 'Step', '');
      onUpDatePipeline(id, 'Branches', []);
      onGetSteps(value);
      dispatch(initSinglePipelineListBranches(id));
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
          options={sortDisabledOptions(deploymentFrequencySettings, options)}
          getOptionDisabled={(option: string) =>
            label === 'Pipeline Name' && getDisabledOptions(deploymentFrequencySettings, option)
          }
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
          renderInput={(params) => (
            <TextField
              required
              {...params}
              label={label}
              variant='standard'
              error={isError}
              helperText={isError ? errorText : DEFAULT_HELPER_TEXT}
            />
          )}
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
