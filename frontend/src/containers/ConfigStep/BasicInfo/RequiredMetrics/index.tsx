import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { RequireDataSelections } from '@src/containers/ConfigStep/BasicInfo/RequiredMetrics/style';
import { selectConfig, updateMetrics } from '@src/context/config/configSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { SELECTED_VALUE_SEPARATOR } from '@src/constants/commons';
import { REQUIRED_DATA } from '@src/constants/resources';
import { useEffect, useState } from 'react';

export const RequiredMetrics = () => {
  const dispatch = useAppDispatch();
  const configData = useAppSelector(selectConfig);
  const { metrics } = configData.basic;
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false);
  useEffect(() => {
    metrics && dispatch(updateMetrics(metrics));
  }, [metrics, dispatch]);

  const [isAllSelected, setIsAllSelected] = useState(false);
  const handleSelectOptionsChange = (selectOptions: string | string[]) => {
    if (selectOptions.includes(REQUIRED_DATA.All) && !isAllSelected) {
      setIsAllSelected(true);
      selectOptions = Object.values(REQUIRED_DATA);
    } else if (selectOptions.length == Object.values(REQUIRED_DATA).length - 1 && !isAllSelected) {
      setIsAllSelected(true);
      selectOptions = Object.values(REQUIRED_DATA);
    } else if (selectOptions.includes(REQUIRED_DATA.All)) {
      setIsAllSelected(false);
      selectOptions = selectOptions.slice(1);
    } else if (!selectOptions.includes(REQUIRED_DATA.All) && isAllSelected) {
      setIsAllSelected(false);
      selectOptions = [];
    }
    return selectOptions;
  };

  const handleRequireDataChange = (event: SelectChangeEvent<typeof metrics>) => {
    const {
      target: { value },
    } = event;

    dispatch(updateMetrics(handleSelectOptionsChange(value)));
    handleSelectOptionsChange(value).length === 0 ? setIsEmptyProjectData(true) : setIsEmptyProjectData(false);
  };

  const handleRenderSelectOptions = (selected: string[]) => {
    if (selected.includes(REQUIRED_DATA.All)) {
      return selected.slice(1).join(SELECTED_VALUE_SEPARATOR);
    }
    return selected.join(SELECTED_VALUE_SEPARATOR);
  };

  return (
    <>
      <RequireDataSelections variant='standard' required error={isEmptyRequireData}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required metrics</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={metrics}
          onChange={handleRequireDataChange}
          renderValue={handleRenderSelectOptions}
        >
          {Object.values(REQUIRED_DATA).map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={metrics.indexOf(data) > -1} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyRequireData && <FormHelperText>Metrics is required</FormHelperText>}
      </RequireDataSelections>
    </>
  );
};
