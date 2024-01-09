package heartbeat.controller.source;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.EnumSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum SourceTypeEnum {

	GITHUB("GitHub");

	private String value;

	private static final Set<String> SourceTypes = EnumSet.allOf(SourceTypeEnum.class)
		.stream()
		.map(SourceTypeEnum::getValue)
		.collect(Collectors.toSet());

	public static boolean isValidType(String value) {
		return SourceTypes.contains(value);
	}

}
