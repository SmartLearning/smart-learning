package com.smart.learning.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Object to return as body in JWT Authentication.
 */
public class JWTTokenVM {

    private String token;

    public JWTTokenVM(String token) {
        this.token = token;
    }

    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
