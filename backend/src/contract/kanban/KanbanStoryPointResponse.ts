import { JiraCard } from "../../models/kanban/JiraCard";
import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";
import { CardCycleTime } from "../../models/kanban/CardCycleTime";

@swaggerClass()
export class KanbanStoryPointResponse {
  @swaggerProperty({
    type: "number",
    required: true,
  })
  storyPointSum: number;

  @swaggerProperty({
    type: "number",
    required: true,
  })
  count: number;

  @swaggerProperty({
    type: "array",
    required: true,
    items: { type: "object" },
  })
  cards: JiraCardResponse[];

  constructor(storyPointSum: number, count: number, cards: JiraCardResponse[]) {
    this.storyPointSum = storyPointSum;
    this.count = count;
    this.cards = cards;
  }
}

export class JiraCardResponse {
  baseInfo: JiraCard;
  cycleTime: CycleTimeInfo[];
  originCycleTime: CycleTimeInfo[];
  cardCycleTime?: CardCycleTime;
  cycleTimeFlat: any;
  totalCycleTimeDivideStoryPoints?: string;

  constructor(
    baseInfo: JiraCard,
    cycleTime: CycleTimeInfo[],
    originCycleTime: CycleTimeInfo[] = [],
    cardCycleTime?: CardCycleTime
  ) {
    this.baseInfo = baseInfo;
    this.cycleTime = cycleTime;
    this.originCycleTime = originCycleTime;
    this.cardCycleTime = cardCycleTime;
  }

  buildCycleTimeFlatObject(): void {
    const obj: any = {};
    for (let j = 0; j < this.originCycleTime.length; j++) {
      const step = this.originCycleTime[j];
      obj[step.column.trim()] = step.day;
    }

    this.cycleTimeFlat = obj;
  }

  calculateTotalCycleTimeDivideStoryPoints(): void {
    const storyPoints = this.getStoryPoint();
    const cycleTime =
      this.cardCycleTime?.total == undefined ? 0 : this.cardCycleTime?.total;
    this.totalCycleTimeDivideStoryPoints =
      storyPoints > 0 ? (cycleTime / storyPoints).toFixed(2) : "";
  }

  getCardId(): string {
    return this.baseInfo.key;
  }

  async getStatus(): Promise<string | undefined> {
    return this.baseInfo.fields.status?.name;
  }

  getStoryPoint(): number {
    return this.baseInfo.fields.storyPoints || 0;
  }

  getTotalOrZero(): number {
    return this.cardCycleTime?.total || 0;
  }
}

export class CycleTimeInfo {
  column: string;
  day: number;

  constructor(column: string, day: number) {
    this.column = column;
    this.day = day;
  }
}
