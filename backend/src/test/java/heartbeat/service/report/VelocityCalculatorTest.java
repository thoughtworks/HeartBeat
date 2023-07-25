package heartbeat.service.report;

import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.service.report.calculator.VelocityCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class VelocityCalculatorTest {

	@InjectMocks
	VelocityCalculator velocityCalculator;

	@Test
	void shouldReturnVelocityDTOWhenCallVelocityCalculator() {

		CardCollection cardCollection = CardCollection.builder().cardsNumber(3).storyPointSum(5).build();

		Velocity velocity = velocityCalculator.calculateVelocity(cardCollection);

		assertThat(velocity.getVelocityForSP()).isEqualTo(5);
		assertThat(velocity.getVelocityForCards()).isEqualTo(3);
	}

}
