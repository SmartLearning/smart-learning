package com.smart.learning.web.rest.errors;

import java.io.Serializable;

public class FieldErrorVM implements Serializable {

    private static final long serialVersionUID = 1L;

    private final String field;

    private final String message;

    private final String objectName;

    public FieldErrorVM(String dto, String field, String message) {
        this.objectName = dto;
        this.field = field;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    public String getMessage() {
        return message;
    }

    public String getObjectName() {
        return objectName;
    }

}
