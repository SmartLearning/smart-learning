package com.smart.learning.domain.learn;

/**
 * Represents a tag to be added to a question.
 * To simplify the learning algorithm, there is no hierarchy for tags
 */
public class Tag {
    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
