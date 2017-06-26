package com.smart.learning.domain.learn;

import java.util.Set;

/**
 * Available items for students to learn
 */
public class Topic {

    private String name;

    //student go further and choose inner topics
    private Set<Topic> children;

    private Set<Tag> tags;

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Topic> getChildren() {
        return children;
    }

    public void setChildren(Set<Topic> children) {
        this.children = children;
    }
}
