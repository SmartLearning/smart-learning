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

        int questionsPerDifficultyLevel = MAX_NUMBER_OF_QUESTIONS_IN_INITIAL_TEST / contents.size();
        List<Question> questions = new LinkedList<>();

        int initialSize;
        do {
            initialSize = questions.size();

            for (Map.Entry<Integer, List<Content>> entry : contents.entrySet()) {
                List<Content> difficultyLevelContents = entry.getValue();
                int questionsPerContent = (int) Math.ceil(((double) questionsPerDifficultyLevel) / difficultyLevelContents.size());

                for (Content content : difficultyLevelContents) {
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
        Range<Integer> range = Range.between(1, difficultyRange.getMaximum());

        List<Content> contentsOfSubject = new LinkedList<>();//todo fill this
        return contentsOfSubject.stream()
            .filter(o -> o.hasTag(DIFFICULTY_TAG))
            .filter(o -> range.contains(o.findTagValue(DIFFICULTY_TAG).map(Integer::valueOf).orElse(-1)))
            .collect(
                Collectors.groupingBy(o -> o.findTagValue(DIFFICULTY_TAG).map(Integer::valueOf).get())

            );
    }


    private Range<Integer> getDifficultyRange(SkillLevel skillLevel) {
        //purposely making some overlaps between ranges
        switch (skillLevel) {
            case BEGINNER:
                return Range.between(1, 3);
            case INTERMEDIATE:
                return Range.between(3, 7);
            case EXPERT:
                return Range.between(7, 10);
            default:
                throw new IllegalStateException();
        }
    }

    @Override
    public GeneratedLesson createLessons(User student, Subject subject, SkillLevel desiredSkillLevel, List<StudentAnswer> testResult) {
        //normalize invalid answers for each difficulty levels
        // start from a difficulty level where success rate is less than 80 percent and get contents
        // sort content based on difficulty levels
        //create lesson

        return null;
    }


    @Override
    public List<Question> questionsForLesson(GeneratedLesson lesson) {
        return null;
    }


}
