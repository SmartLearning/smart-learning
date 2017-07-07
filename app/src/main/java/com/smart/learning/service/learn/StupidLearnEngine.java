package com.smart.learning.service.learn;

import com.smart.learning.domain.User;
import com.smart.learning.domain.learn.*;
import org.apache.commons.lang3.Range;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StupidLearnEngine implements LearnEngine {
    private static final String DIFFICULTY_TAG = "difficulty";
    private static final int DIFFICULTY_LEVELS = 10;
    private static final int MAX_NUMBER_OF_QUESTIONS_IN_INITIAL_TEST = 30;

    @Override
    public List<Question> createInitialTest(Subject subject, SkillLevel skillLevel) {
        Range<Integer> difficultyRange = getDifficultyRange(skillLevel);


        Map<Integer, List<Content>> contents = getContentsForDifficultyRange(subject, difficultyRange);

        int questionsPerDifficultyLevel = MAX_NUMBER_OF_QUESTIONS_IN_INITIAL_TEST / (difficultyRange.getMaximum() - difficultyRange.getMinimum() + 1);
        List<Question> questions = new LinkedList<>();

        int initialSize;
        do {
            initialSize = questions.size();

            for (Map.Entry<Integer, List<Content>> entry : contents.entrySet()) {
                int questionsPerContent = (int) Math.ceil(((double) questionsPerDifficultyLevel) / entry.getValue().size());

                for (Content content : entry.getValue()) {
                    List<Question> contentSelectedQuestions = content.getQuestions().stream()
                        .filter(question -> !questions.contains(question))
                        .limit(questionsPerContent)
                        .collect(Collectors.toList());

                    questions.addAll(contentSelectedQuestions);

                }

            }
        }
        while (initialSize != questions.size()); //if something is added, then there is a chance of adding more on the next iteration

        return questions;
    }

    private Map<Integer, List<Content>> getContentsForDifficultyRange(Subject subject, Range<Integer> difficultyRange) {
        List<Content> contentsOfSubject = new LinkedList<>();//todo fill this
        return contentsOfSubject.stream().filter(o -> difficultyRange.contains(Integer.valueOf(o.findTag(DIFFICULTY_TAG).get().getValue())))
            .collect(
                Collectors.groupingBy(o -> Integer.valueOf(o.findTag(DIFFICULTY_TAG).get().getValue()))

            );
    }


    private Range<Integer> getDifficultyRange(SkillLevel skillLevel) {
        switch (skillLevel) {
            case BEGINNER:
                return Range.between(1, 3);
            case INTERMEDIATE:
                return Range.between(4, 6);
            case EXPERT:
                return Range.between(7, 10);
            default:
                throw new IllegalStateException();
        }
    }

    @Override
    public GeneratedLesson createLessons(User student, Subject subject, SkillLevel desiredSkillLevel, List<StudentAnswer> testResult) {
        return null;
    }


    @Override
    public List<Question> questionsForLesson(GeneratedLesson lesson){
        return null;
    }


}
