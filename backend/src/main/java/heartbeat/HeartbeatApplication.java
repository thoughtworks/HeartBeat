package heartbeat;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableFeignClients
@EnableCaching
@SuppressWarnings("PMD.UseUtilityClass")
@OpenAPIDefinition(info = @Info(title = "Heartbeat API", description = "Heartbeat Information", version = "1.0"))
@EnableScheduling
public class HeartbeatApplication {

	public static void main(String[] args) {
		SpringApplication.run(HeartbeatApplication.class, args);
	}

}
