package heartbeat.client.dto.codebase.github;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class File implements Serializable {

	private String sha;

	private String filename;

	private String status;

	private Integer additions;

	private Integer deletions;

	private Integer changes;

	@JsonProperty("blob_url")
	private String blobUrl;

	@JsonProperty("raw_url")
	private String rawUrl;

	@JsonProperty("contents_url")
	private String contentsUrl;

	private String patch;

}
