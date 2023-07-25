package heartbeat.service.report.calculator;

import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.response.Velocity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class VelocityCalculator {

	public Velocity calculateVelocity(CardCollection cardCollection) {
		return Velocity.builder()
			.velocityForSP(cardCollection.getStoryPointSum())
			.velocityForCards(cardCollection.getCardsNumber())
			.build();
	}

}
