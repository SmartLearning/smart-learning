package com.smart.learning.domain.learn;

import com.smart.learning.domain.util.StringBaseDateModel;
import com.smart.learning.domain.util.Tag;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Document(collection = "questions")
public class Question extends StringBaseDateModel {


    private static final long serialVersionUID = 4213848476891265481L;
    private Content content;

    private String question;

    //the order is the same as teacher's inserted
    @DBRef
    private List<String> choices = new LinkedList<>();

    //answer is one of the choices
    private String answer;

    //the areas this question is related to
    private List<Tag> tags = new LinkedList<>();

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getChoices() {
        return choices;
    }

    public void setChoices(List<String> choices) {
        this.choices = choices;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question1 = (Question) o;
        return Objects.equals(question, question1.question);
    }

    @Override
    public int hashCode() {
        return Objects.hash(question);
    }

    public Optional<Tag> findTag(String tag) {
        return tags.stream().filter(t -> tag.equals(t.getName())).findFirst();
    }
}
