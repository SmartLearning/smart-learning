package com.smart.learning.service.learn;

import com.smart.learning.domain.User;
import com.smart.learning.domain.learn.*;

import java.util.List;
import java.util.Map;

public class NormalLearnEngine implements LearnEngine {
    @Override
    public List<Question> createInitialTest(User student, Map<Subject, SkillLevel> interests) {
        return null;
    }

    @Override
    public List<GeneratedLesson> createLessons(User student, Map<Subject, SkillLevel> interests, List<StudentAnswer> testResult) {
        return null;
    }

    @Override
    public List<Question> questionsForContent(GeneratedLesson lesson, Content content) {
        return null;
    }

    @Override
    public List<Question> questionsForLesson(GeneratedLesson lesson) {
        return null;
    }
}
