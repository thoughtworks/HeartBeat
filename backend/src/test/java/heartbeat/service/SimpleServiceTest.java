package heartbeat.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
public class SimpleServiceTest {
    SimpleService simpleService = new SimpleService();

    @Test
    public void should_return_hello_world() {
        String expected = "Hello World";

        String result = simpleService.hello();

        assertThat(result).isEqualTo(expected);
    }

}