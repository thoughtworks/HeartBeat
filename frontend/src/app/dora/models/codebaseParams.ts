import { LeadTime } from '../types/reportRequestParams';

export class CodebaseParams {
  type: string;
  token: string;
  leadTime: LeadTime[];

  constructor({ type, token, leadTime }: { type: string; token: string; leadTime?: LeadTime[] }) {
    this.type = type;
    this.token = token;
    this.leadTime = leadTime;
  }
}
