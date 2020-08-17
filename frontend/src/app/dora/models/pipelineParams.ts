import { Deployment } from '../types/reportRequestParams';

export class PipelineParams {
  type: string;
  token: string;
  deployment: Deployment[];

  constructor({ type, token, deployment }: { type: string; token: string; deployment?: Deployment[] }) {
    this.type = type;
    this.token = token;
    this.deployment = deployment;
  }
}
