package heartbeat.util;

import heartbeat.controller.board.vo.request.BoardType;
import org.springframework.core.convert.converter.Converter;

public class StringToEnumConverter implements Converter<String, BoardType> {

	@Override
	public BoardType convert(String source) {
		return BoardType.fromValue(source.toLowerCase());
	}

}
