package com.smart.learning.domain.learn;

import com.smart.learning.domain.util.StringBaseDateModel;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

/**
 * Represents a category of learning. Student can
 * choose any of these topics and system will generate a course including some
 * GeneratedLessons.
 */
@Document(collection = "subjects")
public class Subject extends StringBaseDateModel {

    private String name;

    //student can go further and customize sub-subjects they want to learn
    private Set<Subject> children;

    private Set<Tag> tags;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Subject> getChildren() {
        return children;
    }

    public void setChildren(Set<Subject> children) {
        this.children = children;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
