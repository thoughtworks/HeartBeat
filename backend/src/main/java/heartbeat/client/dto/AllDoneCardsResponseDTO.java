package heartbeat.client.dto;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class AllDoneCardsResponseDTO implements Serializable {

    private String total;

    private List<DoneCard> issues;

}
