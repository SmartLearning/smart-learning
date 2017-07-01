package com.smart.learning.service.learn;

import com.smart.learning.domain.User;
import com.smart.learning.domain.learn.*;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;
import java.util.Map;

/**
 * A learn engine that generate learning materials with intelligent algorithms
 */
public class SmartLearnEngine implements LearnEngine {
    @Override
    public List<Question> createInitialTest(User student, Map<Subject, SkillLevel> interests) {
        throw new NotImplementedException("Choose NormalLearnEngine implementations instead");
    }

    @Override
    public List<GeneratedLesson> createLessons(User student, Map<Subject, SkillLevel> interests, List<StudentAnswer> testResult) {
        throw new NotImplementedException("Choose NormalLearnEngine implementations instead");

    }

    @Override
    public List<Question> questionsForContent(GeneratedLesson lesson, Content content) {
        throw new NotImplementedException("Choose NormalLearnEngine implementations instead");

    }

    @Override
    public List<Question> questionsForLesson(GeneratedLesson lesson) {
        throw new NotImplementedException("Choose NormalLearnEngine implementations instead");

    }
}
