package heartbeat.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
@ExtendWith(MockitoExtension.class)
public class SimpleServiceTest {
    SimpleService simpleService = new SimpleService();
    @Test
    public void should_return_hello_world(){
        String expected = "Hello World";
        String result = simpleService.hello();
        assertEquals(result,expected);
    }

}