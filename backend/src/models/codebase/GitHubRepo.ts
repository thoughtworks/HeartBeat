import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("GitHubPull")
export class GitHubRepo {
  @JsonProperty("html_url", String, true)
  repoUrl: string = "";
}
