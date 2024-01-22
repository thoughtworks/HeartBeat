import { SOURCE_CONTROL_TYPES } from '@src/constants/resources';

export interface SourceControlVerifyRequestDTO {
  type: SOURCE_CONTROL_TYPES;
  token: string;
}

export interface SourceControlInfoRequestDTO {
  type: SOURCE_CONTROL_TYPES;
  branch: string;
  repository: string;
  token: string;
}
