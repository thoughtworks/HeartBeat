package heartbeat.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

	@Value("${heartbeat.swagger.host}")
	private String swaggerHost;

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI().components(new Components())
			.info(new Info().title("Backend API").version("1.0"))
			.servers(List.of(new Server().url(String.format("%s/api/v1", this.swaggerHost))));
	}

}
