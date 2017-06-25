package com.smart.learning.service.errors;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 * <p>
 * <p>
 * You can pass parameters with your exception to front end
 * so if you set putParam(name, ?) you could use name parameter in your i18n file like {{params.name}}
 * or just for one parameter you can get it like {{params}}
 */
public class ClientSideException extends RuntimeException {

    private final HashMap<String, Object> params;

    private final HttpStatus status;

    public ClientSideException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.params = new HashMap<>();
    }

    public ClientSideException(String message, Map<String, ?> params, HttpStatus status) {
        super(message);
        this.status = status;
        this.params = new HashMap<>(params);
    }

    public ClientSideException putParam(String key, Object value) {
        params.put(key, value);
        return this;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("status", status)
            .append("params", params)
            .toString();
    }

    public Map<String, Object> getParams() {
        return params;
    }

    public ClientSideException setParams(Map<String, Object> params) {
        this.params.clear();
        this.params.putAll(params);
        return this;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
