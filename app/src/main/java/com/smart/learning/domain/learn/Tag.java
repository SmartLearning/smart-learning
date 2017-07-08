package com.smart.learning.domain.learn;

import com.smart.learning.domain.util.StringBaseDateModel;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a tag to be added to a question.
 * To simplify the learning algorithm, there is no hierarchy for tags
 */
@Document(collection = "tags")
public class Tag extends StringBaseDateModel {
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
