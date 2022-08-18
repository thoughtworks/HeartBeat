import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("BKJobInfo")
export class BKJobInfo {
  @JsonProperty("name", String, true)
  name?: string = undefined;
  @JsonProperty("state", String, true)
  state: string = "";
  @JsonProperty("started_at", String, true)
  startedAt?: string = undefined;
  @JsonProperty("finished_at", String, true)
  finishedAt?: string = undefined;
}

@JsonObject("BKBuildInfo")
export class BKBuildInfo {
  @JsonProperty("jobs", [BKJobInfo], true)
  jobs: BKJobInfo[] = [];
  @JsonProperty("commit", String, true)
  commit: string = "";
  @JsonProperty("created_at", String, true)
  pipelineCreateTime?: string = undefined;
  @JsonProperty("number", Number, true)
  number: number = 0;
}
