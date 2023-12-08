package heartbeat.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI().components(new Components())
			.info(new Info().title("Backend API").version("1.0"))
			.servers(List.of(new Server().url(getCurrentHost() + "/api/v1")));
	}

	private String getCurrentHost() {
		try {
			InetAddress localHost = InetAddress.getLocalHost();
			String hostAddress = localHost.getHostAddress();
			return "http://" + hostAddress + ":4321";
		}
		catch (UnknownHostException e) {
			return "http://backend:4322";
		}
	}

}
