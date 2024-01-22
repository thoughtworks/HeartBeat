export interface SourceControlVerifyRequestDTO {
  type: string;
  token: string;
}

export interface SourceControlInfoRequestDTO {
  type: string;
  branch: string;
  repository: string;
  token: string;
}
