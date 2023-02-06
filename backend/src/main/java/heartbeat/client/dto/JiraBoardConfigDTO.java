package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class JiraBoardConfigDTO {

	private String id;

	private String name;

	private JiraColumnConfig columnConfig;

}
