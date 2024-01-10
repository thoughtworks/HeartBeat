import React, { useMemo } from 'react';
import _ from 'lodash';
import { BranchSelectionWrapper } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection/style';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { selectBranches } from '@src/context/config/configSlice';
import { store } from '@src/store';

export interface BranchSelectionProps {
  id: number;
  organization: string;
  pipelineName: string;
  branches: string[];
  onUpdatePipeline: (id: number, label: string, value: any) => void;
}

export const BranchSelection = (props: BranchSelectionProps) => {
  const { id, organization, pipelineName, branches, onUpdatePipeline } = props;
  const branchesOptions: string[] = selectBranches(store.getState(), organization, pipelineName);
  const isAllBranchesSelected = useMemo(
    () => !_.isEmpty(branchesOptions) && _.isEqual(branches.length, branchesOptions.length),
    [branches, branchesOptions]
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
