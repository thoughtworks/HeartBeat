import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { RequireDataSelections } from '@src/containers/ConfigStep/BasicInfo/RequiredMetrics/style';
import { BASIC_INFO_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { selectMetrics, updateMetrics } from '@src/context/config/configSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { METRICS_LITERAL } from '@src/containers/ConfigStep/Form/literal';
import { SELECTED_VALUE_SEPARATOR } from '@src/constants/commons';
import { Controller, useFormContext } from 'react-hook-form';
import { REQUIRED_DATA } from '@src/constants/resources';

const ALL = 'All';
const ALL_REQUIRED_DATA = Object.values(REQUIRED_DATA) as string[];

export const RequiredMetrics = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectMetrics);
  const { control } = useFormContext();
  const onRender = (selected: string[]) => selected.join(SELECTED_VALUE_SEPARATOR);

  return (
    <>
      <RequireDataSelections variant='standard' required error={metrics.length === 0}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required metrics</InputLabel>
        <Controller
          name={'metrics'}
          control={control}
          render={({ field }) => {
            const isEveryOptionsSelected = ALL_REQUIRED_DATA.every((metric) => field.value.includes(metric));
            const onChange = ({ target: { value: selectedOptions } }: SelectChangeEvent<typeof METRICS_LITERAL>) => {
              const isClickingAll = selectedOptions[selectedOptions.length - 1] === ALL;
              const nextSelectedOptions = isClickingAll
                ? isEveryOptionsSelected
                  ? []
                  : ALL_REQUIRED_DATA
                : selectedOptions;
              field.onChange(nextSelectedOptions);
              dispatch(updateMetrics(nextSelectedOptions));
            };
            return (
              <>
                <Select
                  labelId='require-data-multiple-checkbox-label'
                  multiple
                  {...field}
                  onChange={onChange}
                  renderValue={onRender}
                >
                  <MenuItem key={ALL} value={ALL}>
                    <Checkbox checked={isEveryOptionsSelected} />
                    <ListItemText primary={ALL} />
                  </MenuItem>
                  {ALL_REQUIRED_DATA.map((data) => (
                    <MenuItem key={data} value={data}>
                      <Checkbox checked={field.value.indexOf(data) > -1} />
                      <ListItemText primary={data} />
                    </MenuItem>
                  ))}
                </Select>
                {field.value.length === 0 && (
                  <FormHelperText>{BASIC_INFO_ERROR_MESSAGE.metrics.required}</FormHelperText>
                )}
              </>
            );
          }}
        />
      </RequireDataSelections>
    </>
  );
};
