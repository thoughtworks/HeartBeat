import { JiraCard } from "../../models/kanban/JiraCard";
import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";
import { CardCycleTime } from "../../models/kanban/CardCycleTime";
import { Issue } from "@linear/sdk";

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
  baseInfo: JiraCard | Issue;
  cycleTime: CycleTimeInfo[];
  originCycleTime: CycleTimeInfo[];
  cardCycleTime?: CardCycleTime;
  cycleTimeFlat: any;
  totalCycleTimeDivideStoryPoints?: string;

  constructor(
    baseInfo: JiraCard | Issue,
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

  private getStoryPoint(): number {
    let storyPoints = 0;

    if (this.baseInfo instanceof JiraCard) {
      storyPoints = this.baseInfo.fields.storyPoints || 0;
    }
    if (this.baseInfo instanceof Issue) {
      storyPoints = this.baseInfo.estimate || 0;
    }

    return storyPoints;
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
