package com.smart.learning.web.rest.errors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smart.learning.service.errors.ClientSideException;
import com.smart.learning.web.rest.util.HeaderUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Controller advice to translate the server side exceptions to client-friendly json structures.
 */
@ControllerAdvice
public class ExceptionTranslator {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @ResponseBody
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(AccessDeniedException.class)
    public ErrorVM processAccessDeniedException(AccessDeniedException ex) {
        logger.error(
            "Access Denied: {}, {}",
            ExceptionUtils.getMessage(ex),
            ExceptionUtils.getRootCauseMessage(ex)
        );
        return new ErrorVM(ErrorConstants.ERR_ACCESS_DENIED, ex.getMessage());
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConcurrencyFailureException.class)
    public ErrorVM processConcurrencyError(ConcurrencyFailureException ex) {
        logger.error(
            "Concurrency Failure: {}, {}",
            ExceptionUtils.getMessage(ex),
            ExceptionUtils.getRootCauseMessage(ex)
        );
        return new ErrorVM(ErrorConstants.ERR_CONCURRENCY_FAILURE);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ErrorVM processMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        logger.error(
            "Method Not Allowed: {}, {}",
            ExceptionUtils.getMessage(ex),
            ExceptionUtils.getRootCauseMessage(ex)
        );
        return new ErrorVM(ErrorConstants.ERR_METHOD_NOT_SUPPORTED, ex.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ErrorVM> processRestClientException(RestClientException ex) {
        logger.error(
            "Rest Client Exception: {}, {}",
            ExceptionUtils.getMessage(ex),
            ExceptionUtils.getRootCauseMessage(ex)
        );

        HttpHeaders headers = HeaderUtil.createFailureAlert(ex.getMessage());
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        String message = ErrorConstants.ERR_INTERNAL_SERVER_ERROR;
        String description = ex.getMessage();

        if (HttpStatusCodeException.class.isAssignableFrom(ex.getClass())) {
            HttpStatusCodeException exception = (HttpStatusCodeException) ex;
            status = exception.getStatusCode();
            message = "global.messages.error." + status.value();

            description = exception.getResponseBodyAsString();
            logger.debug("Exception body is: {}", description);

            try {
                ErrorVM errorDTO = new ObjectMapper().readValue(description, ErrorVM.class);
                logger.info("Converted ErrorVM: {}", errorDTO);
                headers = HeaderUtil.createEntityCreationAlert(errorDTO.getMessage(), errorDTO.getDescription());
                message = errorDTO.getMessage();
                description = errorDTO.getDescription();
            } catch (Exception exp) {
                logger.error("Error occurred while converting exception to ErrorVM: exception: {}", exp);
                if (StringUtils.isEmpty(description)) {
                    description = exception.getStatusText();
                }

                HashMap<String, Object> map = new HashMap<>();
                map.put("statusText", exception.getStatusText());
                map.put("statusCode", exception.getStatusCode().value());
                map.put("message", description);

                headers = HeaderUtil.createFailureAlert(message, map);
            }
        }

        return new ResponseEntity<>(new ErrorVM(message, description), headers, status);
    }

    @ExceptionHandler(ClientSideException.class)
    public ResponseEntity<ErrorVM> processRuntimeException(ClientSideException ex) {
        logger.error(
            "Client Side Exception: {}, {}",
            ExceptionUtils.getMessage(ex),
            ExceptionUtils.getRootCauseMessage(ex)
        );
        BodyBuilder builder = ResponseEntity.status(ex.getStatus());
        HttpHeaders headers = HeaderUtil.createFailureAlert(ex.getMessage(), ex.getParams());
        return builder.headers(headers).body(new ErrorVM(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorVM> processRuntimeException(Exception ex) {
        String message = ex.getMessage();
        if (StringUtils.isEmpty(ex.getMessage())) {
            message = "Internal server error";
        }
        if (ConstraintViolationException.class.isAssignableFrom(ex.getClass())) {
            ConstraintViolationException exception = (ConstraintViolationException) ex;
            Set<ConstraintViolation<?>> violations = exception.getConstraintViolations();
            List<String> messages = violations.stream().map(ConstraintViolation::getMessage).collect(Collectors.toList());
            logger.error("Exception cause = {} and violations: {}, exception {}", ex.getCause(), messages, ex);
            message = StringUtils.join(messages, ",\n");
        } else {
            logger.error("Exception cause = {} and exception {}", ex.getCause(), ex);
        }

        BodyBuilder builder = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        String title = ErrorConstants.ERR_INTERNAL_SERVER_ERROR;

        ResponseStatus responseStatus = AnnotationUtils.findAnnotation(ex.getClass(), ResponseStatus.class);
        if (responseStatus != null) {
            builder = ResponseEntity.status(responseStatus.value());
            title = "error." + responseStatus.value().value();
            message = responseStatus.reason();
        }
        return builder.body(new ErrorVM(title, message));
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorVM processValidationError(MethodArgumentNotValidException ex) {
        logger.error(
            "Method Argument Not Valid Exception: {}, {}",
            ExceptionUtils.getMessage(ex),
            ExceptionUtils.getRootCauseMessage(ex)
        );

        BindingResult result = ex.getBindingResult();
        List<FieldError> fieldErrors = result.getFieldErrors();
        ErrorVM dto = new ErrorVM(ErrorConstants.ERR_VALIDATION);
        for (FieldError fieldError : fieldErrors) {
            dto.add(fieldError.getObjectName(), fieldError.getField(), fieldError.getCode());
        }
        return dto;
    }
}
