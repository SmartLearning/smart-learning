package com.smart.learning.domain.learn;

import java.util.List;
import java.util.Set;

public class Question {

    private String text;

    private Set<Tag> tags;

    //the order is the same as teacher's inserted
    private List<String> options;

    //answer is included in the options list
    private String answer;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
