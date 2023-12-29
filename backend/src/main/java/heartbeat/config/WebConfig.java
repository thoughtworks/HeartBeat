package heartbeat.config;

import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.report.dto.request.DataType;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(new Converter<String, BoardType>() {
			@Override
			public BoardType convert(String source) {
				return BoardType.fromValue(source.toLowerCase());
			}
		});

		registry.addConverter(new Converter<String, DataType>() {
			@Override
			public DataType convert(String source) {
				return DataType.fromValue(source);
			}
		});
	}

}
