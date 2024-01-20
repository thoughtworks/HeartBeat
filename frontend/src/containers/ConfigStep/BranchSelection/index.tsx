import { BranchSelectionWrapper } from '@src/containers/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection/style';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { selectBranches } from '@src/context/config/configSlice';
import React, { useMemo } from 'react';
import { store } from '@src/store';
import _ from 'lodash';

export interface BranchSelectionProps {
  id: number;
  organization: string;
  pipelineName: string;
  branches: string[];
  onUpdatePipeline: (id: number, label: string, value: string[] | unknown) => void;
}

export const BranchSelection = (props: BranchSelectionProps) => {
  const { id, organization, pipelineName, branches, onUpdatePipeline } = props;
  const branchesOptions: string[] = selectBranches(store.getState(), organization, pipelineName);
  const isAllBranchesSelected = useMemo(
    () => !_.isEmpty(branchesOptions) && _.isEqual(branches.length, branchesOptions.length),
    [branches, branchesOptions],
  );
  const handleBranchChange = (event: React.SyntheticEvent, value: string[]) => {
    let selectBranches = value;
    if (_.isEqual(selectBranches[selectBranches.length - 1], 'All')) {
      /* istanbul ignore next */
      selectBranches = _.isEqual(branchesOptions.length, branches.length) ? [] : branchesOptions;
    }
    onUpdatePipeline(id, 'Branches', selectBranches);
  };

  return (
    <BranchSelectionWrapper>
      <MultiAutoComplete
        optionList={branchesOptions}
        selectedOption={branches}
        textFieldLabel='Branches'
        isError={false}
        onChangeHandler={handleBranchChange}
        isSelectAll={isAllBranchesSelected}
      />
    </BranchSelectionWrapper>
  );
};
