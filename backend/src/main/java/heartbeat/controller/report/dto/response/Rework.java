package heartbeat.controller.report.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Rework {

	private Integer totalReworkTimes;

	private String reworkState;

	private Integer fromAnalysis;

	private Integer fromInDev;

	private Integer fromBlock;

	private Integer fromWaitingForTesting;

	private Integer fromTesting;

	private Integer fromReview;

	private Integer fromDone;

	private Integer totalReworkCards;

	private Integer throughput;

	private Double reworkCardsRatio;

}
