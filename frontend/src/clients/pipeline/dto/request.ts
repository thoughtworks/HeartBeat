export interface IPipelineVerifyRequestDTO {
  type: string;
  token: string;
}

export interface PipelineInfoRequestDTO {
  type: string;
  token: string;
}

export interface PipelineRequestDTO {
  type: string;
  token: string;
  startTime: string | number | null;
  endTime: string | number | null;
}
