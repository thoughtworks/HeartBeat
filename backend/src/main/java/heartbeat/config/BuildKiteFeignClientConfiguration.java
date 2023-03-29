package heartbeat.config;

import feign.codec.ErrorDecoder;
import heartbeat.decoder.BuildKiteFeignClientDecoder;
import org.springframework.context.annotation.Bean;

public class BuildKiteFeignClientConfiguration {

	@Bean
	public ErrorDecoder errorDecoder() {
		return new BuildKiteFeignClientDecoder();
	}

}
