package com.smart.learning.domain.learn;

import com.smart.learning.domain.util.StringBaseDateModel;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "student_answers")
public class StudentAnswer extends StringBaseDateModel {

    private static final long serialVersionUID = -8821257254280614027L;
    private Question question;
    private boolean success;

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
