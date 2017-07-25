package com.smart.learning.service.learn;

import com.smart.learning.domain.learn.Content;
import com.smart.learning.domain.learn.Question;
import com.smart.learning.domain.learn.SkillLevel;
import com.smart.learning.domain.learn.Subject;
import com.smart.learning.domain.util.Tag;
import org.junit.Test;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

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
        chosenSubject.setContents(Arrays.asList(
            content(3),
            content(1, t(StupidLearnEngine.DIFFICULTY_TAG, "3"))));


        List<Question> initialTest = engine.createInitialTest(chosenSubject, SkillLevel.INTERMEDIATE);

        //todo assert here
    }

    private Content content(int numQuestions, Tag... tags) {
        Content content = new Content();
        List<Question> questions = new LinkedList<>();
        for (int i = 0; i < numQuestions; i++) {
            questions.add(new Question());

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
