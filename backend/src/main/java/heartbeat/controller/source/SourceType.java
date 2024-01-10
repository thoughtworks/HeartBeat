package heartbeat.controller.source;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum SourceType {

	GITHUB("github"),

	ANOTHERSOURCETYPE("anotherSourceType");

	private String value;

	public static SourceType matchSourceType(String value) {
		return switch (value) {
			case "github" -> GITHUB;
			default -> ANOTHERSOURCETYPE;
		};
	}

}
