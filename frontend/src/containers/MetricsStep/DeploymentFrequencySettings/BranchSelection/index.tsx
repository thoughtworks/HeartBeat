import {
  FormFieldWithMeta,
  getFormMeta,
  initMetricsPipelineFormMeta,
  updateFormMeta,
  updateMetricsPipelineBranchFormMeta,
} from '@src/context/meta/metaSlice';
import { BranchSelectionWrapper } from '@src/containers/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection/style';
import BranchChip from '@src/containers/MetricsStep/DeploymentFrequencySettings/BranchSelection/BranchChip';
import { selectPipelineList, selectSourceControl } from '@src/context/config/configSlice';
import { SOURCE_CONTROL_BRANCH_INVALID_TEXT } from '@src/constants/resources';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks';
import { intersection } from 'lodash';

export interface BranchSelectionProps {
  id: number;
  organization: string;
  pipelineName: string;
  branches: string[];
  isStepLoading: boolean;
  onUpdatePipeline: (id: number, label: string, value: string[] | unknown) => void;
}

export const BranchSelection = (props: BranchSelectionProps) => {
  const dispatch = useAppDispatch();
  const { id, organization, pipelineName, branches, onUpdatePipeline, isStepLoading } = props;
  const formMeta = useAppSelector(getFormMeta);
  const pipelineList = useAppSelector(selectPipelineList);
  const sourceControlFields = useAppSelector(selectSourceControl);
  const currentPipeline = useMemo(
    () => pipelineList.find((pipeline) => pipeline.name === pipelineName && pipeline.orgName === organization),
    [organization, pipelineList, pipelineName],
  );

  const validBranches = useMemo(
    () => intersection(currentPipeline?.branches || [], branches),
    [currentPipeline, branches],
  );
  const repository = currentPipeline?.repository ?? '';

  const branchesOptions: FormFieldWithMeta[] = useMemo(() => {
    const branchesOptions = currentPipeline?.branches ?? [];
    return branchesOptions.map((item) => ({ value: item }));
  }, [currentPipeline?.branches]);

  const branchesFormData = useMemo(() => {
    const pipelineMeta = formMeta.metrics.pipelines[id];
    return pipelineMeta?.branches ?? [];
  }, [formMeta.metrics.pipelines, id]);

  const selectedBranchesWithMeta = useMemo(() => {
    return validBranches.map((item) => {
      const metaInfo = branchesFormData.find((branch) => branch.value === item);
      const shouldVerifyBranches = sourceControlFields.token !== '';

      return metaInfo
        ? metaInfo
        : {
            value: item,
            needVerify: shouldVerifyBranches,
          };
    });
  }, [validBranches, branchesFormData, sourceControlFields.token]);

  const updateSingleBranchMeta = useCallback(
    (branchWithMeta: FormFieldWithMeta) => {
      dispatch(
        updateMetricsPipelineBranchFormMeta({
          id,
          data: branchWithMeta,
        }),
      );
    },
    [dispatch, id],
  );

  const updateBranchesMeta = (values: string[]) => {
    const branchesWithMeta = values.map((branch) => {
      const formData = branchesFormData.find((item) => item.value === branch);
      const shouldVerifyBranches = sourceControlFields.token !== '';

      return formData ? formData : { value: branch, needVerify: shouldVerifyBranches };
    });

    dispatch(
      updateFormMeta({
        path: `metrics.pipelines[${id}].branches`,
        data: branchesWithMeta,
      }),
    );
  };

  const handleBranchChange = (_: React.SyntheticEvent, values: FormFieldWithMeta[]) => {
    const options = values.map((item) => item.value);
    updateBranchesMeta(options);
    onUpdatePipeline(id, 'Branches', options);
  };

  const isInputError = useMemo(() => Object.values(branchesFormData).some((item) => item.error), [branchesFormData]);
  const errorDetail = useMemo(
    () => Object.values(branchesFormData).find((item) => item.errorDetail !== undefined)?.errorDetail,
    [branchesFormData],
  );

  useEffect(() => {
    dispatch(initMetricsPipelineFormMeta(id));
  }, [dispatch, id]);

  return (
    <BranchSelectionWrapper>
      <Autocomplete
        aria-label='Pipeline Branch AutoComplete'
        multiple
        options={branchesOptions}
        disableCloseOnSelect
        value={selectedBranchesWithMeta}
        onChange={handleBranchChange}
        getOptionLabel={(option) => option.value}
        isOptionEqualToValue={(option, selected) => option.value === selected.value}
        renderOption={(props, option, { selected }) => {
          return (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option.value}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            required={true}
            error={!isStepLoading && isInputError}
            variant='standard'
            label='Branches'
            helperText={!isStepLoading && isInputError ? SOURCE_CONTROL_BRANCH_INVALID_TEXT[errorDetail as string] : ''}
          />
        )}
        renderTags={(selectedOptions, getTagProps) =>
          selectedOptions.map((option, index) => {
            const { key, ...props } = getTagProps({ index });
            return (
              <BranchChip
                {...props}
                {...option}
                key={key}
                repository={repository}
                updateBranchMeta={updateSingleBranchMeta}
              />
            );
          })
        }
      />
    </BranchSelectionWrapper>
  );
};
