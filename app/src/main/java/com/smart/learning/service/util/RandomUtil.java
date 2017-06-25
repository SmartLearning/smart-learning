package com.smart.learning.service.util;

import org.apache.commons.text.RandomStringGenerator;

/**
 * Utility class for generating random Strings.
 */
public final class RandomUtil {

    private static final int DEF_COUNT = 20;

    private RandomUtil() {
    }

    /**
     * Generate an activation key.
     *
     * @return the generated activation key
     */
    public static String generateActivationKey() {
        return new RandomStringGenerator.Builder().build().generate(DEF_COUNT);
    }

    /**
     * Generate a password.
     *
     * @return the generated password
     */
    public static String generatePassword() {
        return new RandomStringGenerator.Builder().build().generate(DEF_COUNT);
    }

    /**
     * Generate a reset key.
     *
     * @return the generated reset key
     */
    public static String generateResetKey() {
        return new RandomStringGenerator.Builder().build().generate(DEF_COUNT);
    }
}
