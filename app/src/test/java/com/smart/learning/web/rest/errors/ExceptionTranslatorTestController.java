package com.smart.learning.web.rest.errors;

import com.smart.learning.service.errors.ClientSideException;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ExceptionTranslatorTestController {

    @GetMapping("/test/access-denied")
    public void accessdenied() {
        throw new AccessDeniedException("test access denied!");
    }

    @GetMapping("/test/concurrency-failure")
    public void concurrencyFailure() {
        throw new ConcurrencyFailureException("test concurrency failure");
    }

    @GetMapping("/test/response-status")
    public void exceptionWithResponseStatus() {
        throw new TestResponseStatusException();
    }

    @GetMapping("/test/internal-server-error")
    public void internalServerError() {
        throw new RuntimeException();
    }

    @PostMapping("/test/method-argument")
    public void methodArgument(@Valid @RequestBody TestDTO testDTO) {
    }

    @GetMapping("/test/parameterized-error")
    public void parameterizedError() {
        Map<String, String> params = new HashMap<>();
        params.put("param0", "param0_value");
        params.put("param1", "param1_value");
        throw new ClientSideException("test parameterized error", params, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/test/parameterized-error2")
    public void parameterizedError2() {
        Map<String, String> params = new HashMap<>();
        params.put("foo", "foo_value");
        params.put("bar", "bar_value");
        throw new ClientSideException("test parameterized error", params, HttpStatus.BAD_REQUEST);
    }

    public static class TestDTO {

        @NotNull
        private String test;

        public String getTest() {
            return test;
        }

        public void setTest(String test) {
            this.test = test;
        }
    }

    @SuppressWarnings("serial")
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "test response status")
    public static class TestResponseStatusException extends RuntimeException {

    }

}
