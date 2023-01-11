package heartbeat.controller;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.health.Status;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HealthControllerTest {
    @Mock
    private HealthEndpoint healthEndpoint;
    @InjectMocks
    private HealthController healthController;

    @Test
    void should_return_health_status() {
        HealthComponent mockHealth = mock(HealthComponent.class);
        when(healthEndpoint.health()).thenReturn(mockHealth);
        when(mockHealth.getStatus()).thenReturn(Status.UP);

        Status healthStatus = healthController.getHealthStatus();

        assertThat(healthStatus).isEqualTo(Status.UP);
    }
}