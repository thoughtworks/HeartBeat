package heartbeat.controller.source;

import heartbeat.exception.BadRequestException;

public enum SourceType {

	GITHUB;

	public static SourceType fromValue(String sourceType) {
		return switch (sourceType) {
			case "github" -> GITHUB;
			default -> throw new BadRequestException("Source type is incorrect.");
		};
	}

}
