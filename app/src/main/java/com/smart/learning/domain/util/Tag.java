package com.smart.learning.domain.util;

import java.io.Serializable;

/**
 * Represents a tag to be added to a question.
 * To simplify the learning algorithm, there is no hierarchy for tags
 */
public class Tag implements Serializable {

    private static final long serialVersionUID = -2381960015469845872L;
    private String name;
    private String value;

    public Tag(String name, String value) {

        this.name = name;
        this.value = value;
    }

    public Tag() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
