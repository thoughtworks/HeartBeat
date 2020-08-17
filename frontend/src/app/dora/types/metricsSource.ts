import { Pipeline } from './pipeline';
import { Board } from './board';

export interface MetricsSource {
  pipelineTool?: { type: string; data: Pipeline[] };
  board?: { type: string; data: Board };
  sourceControl?: { type: string; data: Pipeline[] };
}
