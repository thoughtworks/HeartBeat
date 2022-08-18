import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("GitHubPull")
export class GitHubPull {
  @JsonProperty("created_at", String, true)
  createdAt: string = "";

  @JsonProperty("merged_at", String, true)
  mergedAt: string | null = null;

  @JsonProperty("number", Number, true)
  number: number = 0;
}
