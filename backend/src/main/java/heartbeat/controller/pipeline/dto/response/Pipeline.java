package heartbeat.controller.pipeline.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Pipeline {

	String id;

	String name;

	String orgId;

	String orgName;

	String repository;

	List<String> steps;

}
