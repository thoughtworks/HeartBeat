package heartbeat.controller.pipeline.dto.request;

import lombok.extern.log4j.Log4j2;

@Log4j2
public enum PipelineType {

	BUILDKITE("buildkite");

	public final String pipelineType;

	PipelineType(String pipelineType) {
		this.pipelineType = pipelineType;
	}

	public static PipelineType fromValue(String type) {
		return switch (type) {
			case "buildkite" -> BUILDKITE;
			default -> {
				log.error("Failed to match Pipeline type: {} ", type);
				throw new IllegalArgumentException("Pipeline type does not find!");
			}
		};
	}

}
