import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("GitOrganization")
export class GitOrganization {
  @JsonProperty("login", String, true)
  orgName: string = "";
}
