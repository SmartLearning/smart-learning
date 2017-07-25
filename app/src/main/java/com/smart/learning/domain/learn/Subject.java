package com.smart.learning.domain.learn;

import com.smart.learning.domain.util.StringBaseDateModel;
import com.smart.learning.domain.util.Tag;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Represents a category of learning. Student can
 * choose any of these topics and system will generate a course including some
 * GeneratedLessons.
 */
@Document(collection = "subjects")
public class Subject extends StringBaseDateModel {


    private static final long serialVersionUID = -4945393383734576150L;
    private String name;

    //student can go further and customize sub-subjects they want to learn
    @DBRef
    private List<Subject> children;

    private List<Tag> tags;

    private boolean topLevel;

    @DBRef
    private List<Content> contents;

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Subject> getChildren() {
        return children;
    }

    public void setChildren(List<Subject> children) {
        this.children = children;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public boolean isTopLevel() {
        return topLevel;
    }

    public void setTopLevel(boolean topLevel) {
        this.topLevel = topLevel;
    }
}
