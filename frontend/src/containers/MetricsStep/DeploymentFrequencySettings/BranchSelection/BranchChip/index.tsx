import { AXIOS_REQUEST_ERROR_CODE, SOURCE_CONTROL_TYPES } from '@src/constants/resources';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { SourceControlInfoRequestDTO } from '@src/clients/sourceControl/dto/request';
import { selectSourceControl } from '@src/context/config/configSlice';
import { FormFieldWithMeta } from '@src/context/meta/metaSlice';
import ChipExtended from '@src/components/Common/ChipExtended';
import React, { useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '@src/hooks/useAppDispatch';
import { ChipProps } from '@mui/material/Chip/Chip';
import { HttpStatusCode } from 'axios';

type Props = ChipProps &
  FormFieldWithMeta & {
    repository: string;
    updateBranchMeta: (branchWithMeta: FormFieldWithMeta) => void;
  };

const BranchChip = ({ value, needVerify, error, updateBranchMeta, repository, errorDetail, ...props }: Props) => {
  const pending = useRef(false);
  const sourceControlFields = useAppSelector(selectSourceControl);

  const verifyBranch = useCallback(async () => {
    pending.current = true;

    const params: SourceControlInfoRequestDTO = {
      type: sourceControlFields.type as SOURCE_CONTROL_TYPES,
      token: sourceControlFields.token,
      branch: value,
      repository,
    };
    const response = await sourceControlClient.verifyBranch(params);

    if (response.code === HttpStatusCode.NoContent) {
      updateBranchMeta({ value });
    } else {
      updateBranchMeta({ value, error: true, errorDetail: response.code });
    }

    pending.current = false;
  }, [repository, sourceControlFields.token, sourceControlFields.type, updateBranchMeta, value]);

  const handleRetry = useCallback(async () => {
    updateBranchMeta({ value, needVerify: true });
  }, [updateBranchMeta, value]);

  useEffect(() => {
    if (needVerify && !pending.current) {
      verifyBranch();
    }
  }, [error, needVerify, value, verifyBranch]);

  return (
    <ChipExtended
      {...props}
      label={value}
      loading={needVerify}
      error={error}
      showRetry={errorDetail === AXIOS_REQUEST_ERROR_CODE.TIMEOUT}
      onRetry={handleRetry}
    />
  );
};

export default React.memo(BranchChip);
