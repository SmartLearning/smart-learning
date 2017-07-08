package com.smart.learning.service.learn;

import com.smart.learning.domain.User;
import com.smart.learning.domain.learn.*;

import java.util.List;

public interface LearnEngine {
    List<Question> createInitialTest(Subject subject, SkillLevel skillLevel);

    GeneratedLesson createLessons(User student, Subject subject, SkillLevel desiredSkillLevel, List<StudentAnswer> testResult);

    List<Question> questionsForLesson(GeneratedLesson lesson);
}
