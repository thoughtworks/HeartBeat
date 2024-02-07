import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { RequireDataSelections } from '@src/containers/ConfigStep/BasicInfo/RequiredMetrics/style';
import { selectConfig, updateMetrics } from '@src/context/config/configSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { SELECTED_VALUE_SEPARATOR } from '@src/constants/commons';
import { REQUIRED_DATA } from '@src/constants/resources';
import { useMemo, useEffect } from 'react';

const ALL = 'All';

export const RequiredMetrics = () => {
  const dispatch = useAppDispatch();
  const {
    basic: { metrics },
  } = useAppSelector(selectConfig);

  useEffect(() => {
    metrics && dispatch(updateMetrics(metrics));
  }, [metrics, dispatch]);

  const isEveryOptionsSelected = (options: string[]) =>
    Object.values(REQUIRED_DATA).every((metric) => options.includes(metric));

  const isAllSelected = useMemo(() => isEveryOptionsSelected(metrics), [metrics]);

  const isClickedAll = (options: string[]) => isEveryOptionsSelected(options) || options[options.length - 1] === ALL;

  const handleRequireDataChange = ({ target: { value: selectedOptions } }: SelectChangeEvent<typeof metrics>) => {
    const nextSelectedOptions = isClickedAll(selectedOptions as string[])
      ? isAllSelected
        ? []
        : Object.values(REQUIRED_DATA)
      : selectedOptions;
    dispatch(updateMetrics(nextSelectedOptions));
  };

  const handleRenderSelectOptions = (selected: string[]) => selected.join(SELECTED_VALUE_SEPARATOR);

  return (
    <>
      <RequireDataSelections variant='standard' required error={metrics.length === 0}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required metrics</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={metrics}
          onChange={handleRequireDataChange}
          renderValue={handleRenderSelectOptions}
        >
          <MenuItem key={ALL} value={ALL}>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary={ALL} />
          </MenuItem>
          {Object.values(REQUIRED_DATA).map((data) => (
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
