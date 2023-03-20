package heartbeat.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.health.Status;

@ExtendWith(MockitoExtension.class)
class HealthControllerTest {

	@Mock
	private static HealthEndpoint healthEndpoint;

	@InjectMocks
	private static HealthController healthController;

	@Test
	void shouldReturnHealthStatus() {

		HealthComponent mockHealth = mock(HealthComponent.class);
		when(healthEndpoint.health()).thenReturn(mockHealth);
		when(mockHealth.getStatus()).thenReturn(Status.UP);

		Status healthStatus = healthController.getHealthStatus();

		assertThat(healthStatus).isEqualTo(Status.UP);
	}

}
