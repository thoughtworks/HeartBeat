package heartbeat.decoder;

import feign.Request;
import feign.Request.HttpMethod;
import feign.Response;
import java.util.Collection;
import java.util.HashMap;

public class ResponseMockUtil {

	Response getMockResponse(int statusCode) {
		return Response.builder()
			.status(statusCode)
			.request(Request.create(HttpMethod.GET, "", new HashMap<String, Collection<String>>(), null, null, null))
			.build();
	}

}
