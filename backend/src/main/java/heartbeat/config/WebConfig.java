package heartbeat.config;

import heartbeat.controller.pipeline.dto.request.PipelineType;
import heartbeat.controller.report.dto.request.DataType;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.source.SourceType;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(new Converter<String, DataType>() {
			@Override
			public DataType convert(String source) {
				return DataType.fromValue(source);
			}
		});

		registry.addConverter(new Converter<String, ReportType>() {
			@Override
			public ReportType convert(String type) {
				return ReportType.fromValue(type);
			}
		});

		registry.addConverter(new Converter<String, PipelineType>() {
			@Override
			public PipelineType convert(String type) {
				return PipelineType.fromValue(type);
			}
		});

		registry.addConverter(new Converter<String, SourceType>() {
			@Override
			public SourceType convert(String type) {
				return SourceType.fromValue(type);
			}
		});
	}

}
