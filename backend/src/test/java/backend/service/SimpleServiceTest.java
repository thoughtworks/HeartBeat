package backend.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;

import static org.junit.jupiter.api.Assertions.*;
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