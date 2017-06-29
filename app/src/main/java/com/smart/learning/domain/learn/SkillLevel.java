package com.smart.learning.domain.learn;

public enum SkillLevel {

    BEGINNER("0"),
    INTERMEDIATE("1"),
    EXPERT("2");

    private final String name;


    SkillLevel(String name) {
        this.name = name;
    }
}
