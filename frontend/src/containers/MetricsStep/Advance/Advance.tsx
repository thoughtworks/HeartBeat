import { selectAdvancedSettings, updateAdvancedSettings } from '@src/context/Metrics/metricsSlice';
import { AdvancedContainer, AdvancedForm, AdvancedTitleContainer, AdvancedWrapper } from './style';
import { ItemCheckbox, TitleAndTooltipContainer, TooltipContainer } from '../CycleTime/style';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { StyledLink } from '@src/containers/MetricsStep/style';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks';
import { TextField } from '@mui/material';
import React, { useState } from 'react';

export interface Field {
  key: string;
  value: string;
  validateRule?: (value: string) => boolean;
  validatedError: string;
  verifiedError: string;
  col: number;
}

export const Advance = () => {
  const url = 'https://github.com/au-heartbeat/Heartbeat/blob/main/README.md#323-setting-advanced-setting';
  const dispatch = useAppDispatch();
  const advancedSettings = useAppSelector(selectAdvancedSettings);
  const [open, setOpen] = useState(!!advancedSettings);
  const [fields, setFields] = useState<Field[]>([
    {
      key: 'Story Point',
      value: advancedSettings?.storyPoint ?? '',
      validatedError: '',
      verifiedError: '',
      col: 2,
    },
    {
      key: 'Flag',
      value: advancedSettings?.flag ?? '',
      validatedError: '',
      verifiedError: '',
      col: 2,
    },
  ]);

  const toggleAdvancedSettings = () => {
    const newFields = fields.map((field) => ({
      ...field,
      value: '',
    }));
    setOpen(!open);
    setFields(newFields);
    dispatch(updateAdvancedSettings(null));
  };

  function getAdvancedSettings(fields: Field[]) {
    const storyPoint = fields.find((item) => item.key === 'Story Point')?.value;
    const flag = fields.find((item) => item.key === 'Flag')?.value;
    if (storyPoint === '' && flag === '') return null;
    return { storyPoint, flag };
  }

  const handleUpdate = (fields: Field[]) => {
    setFields(fields);
    dispatch(updateAdvancedSettings(getAdvancedSettings(fields)));
  };

  const updateField = (key: string, value: string) => {
    const newFields = fields.map((field) =>
      field.key === key
        ? {
            ...field,
            value: value.trim(),
          }
        : field,
    );
    handleUpdate(newFields);
  };

  return (
    <>
      <AdvancedContainer onClick={toggleAdvancedSettings}>
        <ItemCheckbox checked={open} />
        <TitleAndTooltipContainer>
          <AdvancedTitleContainer>Advanced settings</AdvancedTitleContainer>
          <TooltipContainer data-test-id={'tooltip'}>
            <StyledLink underline='none' href={url} target='_blank' rel='noopener'>
              <HelpOutlineOutlinedIcon fontSize='small' />
              <span>How to setup</span>
            </StyledLink>
          </TooltipContainer>
        </TitleAndTooltipContainer>
      </AdvancedContainer>

      {open && (
        <>
          <AdvancedWrapper>
            <AdvancedForm>
              {fields.map(({ key, col, value }, index) => (
                <TextField
                  variant='standard'
                  sx={{ gridColumn: `span ${col}` }}
                  key={index}
                  label={key}
                  value={value}
                  data-testid={key}
                  inputProps={{ 'aria-label': `input ${key}` }}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder={'Customized filed key'}
                />
              ))}
            </AdvancedForm>
          </AdvancedWrapper>
        </>
      )}
    </>
  );
};
