import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { RequireDataSelections } from '@src/containers/ConfigStep/BasicInfo/RequiredMetrics/style';
import { selectMetrics, updateMetrics } from '@src/context/config/configSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { SELECTED_VALUE_SEPARATOR } from '@src/constants/commons';
import { REQUIRED_DATA } from '@src/constants/resources';
import { useMemo, useCallback } from 'react';

const ALL = 'All';
const ALL_REQUIRED_DATA = Object.values(REQUIRED_DATA) as string[];

export const RequiredMetrics = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectMetrics);

  const isEveryOptionsSelected = useCallback(
    (options: string[]) => ALL_REQUIRED_DATA.every((metric) => options.includes(metric)),
    [],
  );

  const isAllSelected = useMemo(() => isEveryOptionsSelected(metrics), [isEveryOptionsSelected, metrics]);

  const isClickedAll = (options: string[]) => isEveryOptionsSelected(options) || options[options.length - 1] === ALL;

  const onChange = ({ target: { value: selectedOptions } }: SelectChangeEvent<typeof metrics>) => {
    const nextSelectedOptions = isClickedAll(selectedOptions as string[])
      ? isAllSelected
        ? []
        : ALL_REQUIRED_DATA
      : selectedOptions;
    dispatch(updateMetrics(nextSelectedOptions));
  };

  const onRender = (selected: string[]) => selected.join(SELECTED_VALUE_SEPARATOR);

  return (
    <>
      <RequireDataSelections variant='standard' required error={metrics.length === 0}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required metrics</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={metrics}
          onChange={onChange}
          renderValue={onRender}
        >
          <MenuItem key={ALL} value={ALL}>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary={ALL} />
          </MenuItem>
          {ALL_REQUIRED_DATA.map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={metrics.indexOf(data) > -1} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {metrics.length === 0 && <FormHelperText>Metrics is required</FormHelperText>}
      </RequireDataSelections>
    </>
  );
};
