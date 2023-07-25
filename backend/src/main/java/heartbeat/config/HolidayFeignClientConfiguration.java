package heartbeat.config;

import feign.codec.Decoder;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

import java.util.Collections;
import java.util.List;

public class HolidayFeignClientConfiguration {

	@Bean
	public Decoder textPlainDecoder() {
		return new SpringDecoder(() -> new HttpMessageConverters(new CustomMappingJackson2HttpMessageConverter()));
	}

	class CustomMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter {

		@Override
		public void setSupportedMediaTypes(List<MediaType> supportedMediaTypes) {
			super.setSupportedMediaTypes(Collections.singletonList(MediaType.TEXT_PLAIN));
		}

	}

}
