package com.smart.learning.service.learn;

import com.smart.learning.domain.User;
import com.smart.learning.domain.learn.*;

import java.util.List;
import java.util.Map;

public interface LearnEngine {


    /**
     * @param interests student selects his interested subjects
     *                  with the level of proficiency he wants for each
     * @return ordered list of questions that need to be asked from student
     * to generate a learning plan for him
     */
    List<Question> createInitialTest(User student, Map<Subject, SkillLevel> interests);

    /**
     * Creates a course for student based on his interests, current level, and test result
     *
     * @param student
     * @param interests
     * @param testResult the result of the test created by method createInitialTest
     * @return
     */
    List<GeneratedLesson> createLessons(User student, Map<Subject, SkillLevel> interests,
                                        List<StudentAnswer> testResult);

    /**
     * Creates questions for the content that student is learning. This is a practice test and
     * the purpose is to make sure the student has learned the content well enough.
     */
    List<Question> questionsForContent(GeneratedLesson lesson, Content content);

    /**
     * Exam for the end of a lesson. Student needs to answer created questions at the end of
     * each term and after learning all contents of a lesson.
     */
    List<Question> questionsForLesson(GeneratedLesson lesson);


}
