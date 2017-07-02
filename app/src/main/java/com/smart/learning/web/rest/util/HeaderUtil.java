package com.smart.learning.web.rest.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.Map;

import static com.smart.learning.config.Constants.HeaderMessage.*;

/**
 * Utility class for HTTP headers creation.
 */
public class HeaderUtil {

    public static final String HEADER_ALERT = "X-smartApp-alert";

    public static final String HEADER_ERROR = "X-smartApp-error";

    public static final String HEADER_PARAMS = "X-smartApp-params";

    private static final Logger logger = LoggerFactory.getLogger(HeaderUtil.class);

    private HeaderUtil() {
    }

    public static HttpHeaders createAlert(String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HEADER_ALERT, message);
        return headers;
    }

    public static HttpHeaders createAlert(String message, String param) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HEADER_ALERT, message);
        headers.add(HEADER_PARAMS, param);
        return headers;
    }

    public static HttpHeaders createAlert(String message, Map<String, Object> params) {
        HttpHeaders headers = createAlert(message);
        try {
            headers.add(HEADER_PARAMS, new ObjectMapper().writeValueAsString(params));
        } catch (JsonProcessingException e) {
            logger.error("Error in processing header parameters {}", e);
        }
        return headers;
    }

    public static HttpHeaders createEntityCreationAlert(String entityName) {
        return createAlert(entityName + MESSAGE_CREATED);
    }

    public static HttpHeaders createEntityCreationAlert(String entityName, String param) {
        return createAlert(entityName + MESSAGE_CREATED, param);
    }

    public static HttpHeaders createEntityCreationAlert(String entityName, Map<String, Object> params) {
        return createAlert(entityName + MESSAGE_CREATED, params);
    }

    public static HttpHeaders createEntityDeletionAlert(String entityName) {
        return createAlert(entityName + MESSAGE_DELETED);
    }

    public static HttpHeaders createEntityDeletionAlert(String entityName, String param) {
        return createAlert(entityName + MESSAGE_DELETED, param);
    }

    public static HttpHeaders createEntityDeletionAlert(String entityName, Map<String, Object> params) {
        return createAlert(entityName + MESSAGE_DELETED, params);
    }

    public static HttpHeaders createEntityUpdateAlert(String entityName) {
        return createAlert(entityName + MESSAGE_UPDATED);
    }

    public static HttpHeaders createEntityUpdateAlert(String entityName, String param) {
        return createAlert(entityName + MESSAGE_UPDATED, param);
    }

    public static HttpHeaders createEntityUpdateAlert(String entityName, Map<String, Object> params) {
        return createAlert(entityName + MESSAGE_UPDATED, params);
    }

    public static HttpHeaders createFailureAlert(String errorKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HEADER_ERROR, errorKey);
        return headers;
    }

    public static HttpHeaders createFailureAlert(String entityName, String errorKey) {
        return createFailureAlert(entityName + "." + errorKey);
    }

    public static HttpHeaders createFailureAlert(String entityName, String errorKey, String params) {
        Map<String, Object> map = new HashMap<>();
        map.put("param", params);
        return createFailureAlert(entityName, errorKey, map);
    }

    public static HttpHeaders createFailureAlert(String entityName, String errorKey, Map<String, Object> params) {
        return createFailureAlert(entityName + "." + errorKey, params);
    }

    public static HttpHeaders createFailureAlert(String errorKey, Map<String, Object> params) {
        HttpHeaders headers = createFailureAlert(errorKey);
        if (params != null) {
            try {
                headers.add(HEADER_PARAMS, new ObjectMapper().writeValueAsString(params));
            } catch (JsonProcessingException e) {
                logger.error("Error in processing header parameters {}", e);
            }
        }
        return headers;
    }

    public static Map<String, Object> fetchParams(HttpHeaders headers) {
        if (headers.containsKey(HEADER_PARAMS)) {
            String params = headers.getFirst(HEADER_PARAMS);
            return toMap(params);
        }

        return new HashMap<>();
    }

    public static Map<String, Object> toMap(String headers) {
        TypeReference<Map<String, Object>> reference = new TypeReference<Map<String, Object>>() {
        };
        try {
            return new ObjectMapper().readValue(headers, reference);
        } catch (Exception e) {
            logger.error("Unable to convert headers to Map class type due to: {}", e);
            return new HashMap<>();
        }
    }
}
