package com.smart.learning.service.learn;

import com.smart.learning.domain.learn.Content;
import com.smart.learning.domain.learn.Question;
import com.smart.learning.domain.learn.SkillLevel;
import com.smart.learning.domain.learn.Subject;
import com.smart.learning.domain.util.Tag;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Test;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class StupidLearnEngineTest {

    private StupidLearnEngine engine = new StupidLearnEngine();

    @Test(expected = RuntimeException.class)
    public void createInitialTest_shouldHandleContentWithNoTag() throws Exception {

        //create a subject with contents
        Subject chosenSubject = new Subject();
        chosenSubject.setContents(Arrays.asList(
            content(3),
            content(1, t("someTag", "someValue"))));


        engine.createInitialTest(chosenSubject, SkillLevel.INTERMEDIATE);

    }

    @Test
    public void createInitialTest_shouldIgnoreContentsWithNoTag() throws Exception {

        //create a subject with contents
        Subject chosenSubject = new Subject();
        SkillLevel desiredSkillLevel = SkillLevel.INTERMEDIATE;

        Content content = content(1, t(StupidLearnEngine.DIFFICULTY_TAG, "4"));
        chosenSubject.setContents(Arrays.asList(
            content(3),
            content));


        List<Question> initialTest = engine.createInitialTest(chosenSubject, desiredSkillLevel);

        assertTrue(initialTest.contains(content.getQuestions().get(0)));
        assertEquals(1, initialTest.size());
    }

    @Test
    public void createInitialTest_shouldIgnoreContentsWithHighSkillLevels() throws Exception {

        //create a subject with contents
        Subject chosenSubject = new Subject();
        SkillLevel desiredSkillLevel = SkillLevel.INTERMEDIATE;

        Content content = content(1, t(StupidLearnEngine.DIFFICULTY_TAG, "4"));
        Content ignoredContent = content(1, t(StupidLearnEngine.DIFFICULTY_TAG, "8"));
        chosenSubject.setContents(Arrays.asList(
            content(3),
            content,
            ignoredContent));


        List<Question> initialTest = engine.createInitialTest(chosenSubject, desiredSkillLevel);

        assertTrue(initialTest.contains(content.getQuestions().get(0)));
        assertEquals(1, initialTest.size());
    }

    @Test
    public void createInitialTest_shouldIncludeBelowSkillLevels() throws Exception {

        //create a subject with contents
        Subject chosenSubject = new Subject();
        SkillLevel desiredSkillLevel = SkillLevel.INTERMEDIATE;

        Content content = content(1, t(StupidLearnEngine.DIFFICULTY_TAG, "4"));
        Content easyContent = content(1, t(StupidLearnEngine.DIFFICULTY_TAG, "1"));
        chosenSubject.setContents(Arrays.asList(
            content(3),
            content,
            easyContent));


        List<Question> initialTest = engine.createInitialTest(chosenSubject, desiredSkillLevel);

        assertTrue(initialTest.contains(content.getQuestions().get(0)));
        assertTrue(initialTest.contains(easyContent.getQuestions().get(0)));
        assertEquals(2, initialTest.size());
    }


    @Test
    public void createInitialTest_shouldIncludeLimitedQuestionsFromEachContent() throws Exception {

        //create a subject with contents
        Subject chosenSubject = new Subject();
        SkillLevel desiredSkillLevel = SkillLevel.INTERMEDIATE;

        Content content1 = content(40, t(StupidLearnEngine.DIFFICULTY_TAG, "4"));
        Content content2 = content(40, t(StupidLearnEngine.DIFFICULTY_TAG, "3"));
        Content content3 = content(40, t(StupidLearnEngine.DIFFICULTY_TAG, "1"));
        chosenSubject.setContents(Arrays.asList(
            content(3),
            content1,
            content2,
            content3));


        List<Question> initialTest = engine.createInitialTest(chosenSubject, desiredSkillLevel);

        assertEquals(30, initialTest.size());
        initialTest.retainAll(content1.getQuestions());

        assertEquals(30, initialTest.size());
        initialTest.retainAll(content2.getQuestions());

        assertEquals(30, initialTest.size());
        initialTest.retainAll(content3.getQuestions());


    }

    private Content content(int numQuestions, Tag... tags) {
        Content content = new Content();
        content.setId(RandomStringUtils.randomNumeric(5));
        List<Question> questions = new LinkedList<>();
        for (int i = 0; i < numQuestions; i++) {
            Question question = new Question();
            question.setId(RandomStringUtils.randomNumeric(5));
            questions.add(question);

        }
        content.setQuestions(questions);
        if (tags.length != 0)
            content.setTags(Arrays.asList(tags));
        return content;
    }

    private Tag t(String name, String value) {
        Tag tag = new Tag();
        tag.setName(name);
        tag.setValue(value);
        return tag;
    }
}
