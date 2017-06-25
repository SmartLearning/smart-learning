package com.smart.learning.cucumber.stepdefs;

import com.smart.learning.LearningApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = LearningApplication.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
