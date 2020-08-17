import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Committer")
export class Committer {
  @JsonProperty("name", String, true)
  name: string = "";
  @JsonProperty("date", String, true)
  date: string = "";
}

@JsonObject("Commit")
export class Commit {
  @JsonProperty("committer", Committer, true)
  committer?: Committer = undefined;
}

@JsonObject("CommitInfo")
export class CommitInfo {
  @JsonProperty("commit", Commit, true)
  commit?: Commit = undefined;
}
