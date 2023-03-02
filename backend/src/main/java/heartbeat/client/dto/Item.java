package heartbeat.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class Item implements Serializable {

	private String fieldId;

	private To to;

}
