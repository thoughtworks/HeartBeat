package heartbeat.controller.source;

import heartbeat.exception.BadRequestException;
import lombok.extern.log4j.Log4j2;

@Log4j2
public enum SourceType {

	GITHUB;

	public static SourceType fromValue(String type) {
		return switch (type) {
			case "github" -> GITHUB;
			default -> {
				log.error("Failed to match Source type: {} ", type);
				throw new BadRequestException("Source type is incorrect.");
			}
		};
	}

}
