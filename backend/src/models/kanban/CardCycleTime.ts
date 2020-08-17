import { JsonObject, JsonProperty } from "json2typescript";

export class CardCycleTime {
  name: string;
  steps: StepsDay;
  total: number;

  constructor(name: string, steps: StepsDay, total: number) {
    this.name = name;
    this.steps = steps;
    this.total = total;
  }
}

@JsonObject("StepsDay")
export class StepsDay {
  @JsonProperty("analyse")
  analyse: number = 0;
  @JsonProperty("development")
  development: number = 0;
  @JsonProperty("waiting")
  waiting: number = 0;
  @JsonProperty("testing")
  testing: number = 0;
  @JsonProperty("blocked")
  blocked: number = 0;
  @JsonProperty("review")
  review: number = 0;
}
