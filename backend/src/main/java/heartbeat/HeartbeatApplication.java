package heartbeat;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "HeartBeat API",description = "HeartBeat Information"))
public class HeartbeatApplication {

	public static void main(String[] args) {
		SpringApplication.run(HeartbeatApplication.class, args);
	}

}
