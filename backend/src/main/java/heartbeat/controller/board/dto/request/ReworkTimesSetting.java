package heartbeat.controller.board.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ReworkTimesSetting {

	private String reworkState;

	private List<String> excludedStates;

	public CardStepsEnum getEnumReworkState() {
		return CardStepsEnum.fromValue(reworkState);
	}

	public List<CardStepsEnum> getEnumExcludeStates() {
		return excludedStates.stream().map(CardStepsEnum::fromValue).toList();
	}

}
