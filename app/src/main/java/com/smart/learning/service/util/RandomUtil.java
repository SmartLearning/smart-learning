package com.smart.learning.service.util;

import org.apache.commons.rng.UniformRandomProvider;
import org.apache.commons.rng.simple.RandomSource;
import org.apache.commons.text.RandomStringGenerator;

/**
 * Utility class for generating random Strings.
 */
public final class RandomUtil {

    private RandomUtil() {
    }

    /**
     * Generate an activation key.
     *
     * @return the generated activation key
     */
    public static String generateActivationKey() {
        RandomStringGenerator generator = new RandomStringGenerator.Builder()
            .withinRange('a', 'z')
            .build();
        return generator.generate(20);
    }

    /**
     * Generate a password.
     *
     * @return the generated password
     */
    public static String generatePassword() {
        UniformRandomProvider rng = RandomSource.create(RandomSource.WELL_19937_A);
        RandomStringGenerator generator = new RandomStringGenerator.Builder()
            .withinRange('a', 'z')
            .usingRandom(rng::nextInt) // uses Java 8 syntax
            .build();
        return generator.generate(60);
    }

    /**
     * Generate a reset key.
     *
     * @return the generated reset key
     */
    public static String generateResetKey() {
        RandomStringGenerator generator = new RandomStringGenerator.Builder()
            .withinRange('a', 'z')
            .build();
        return generator.generate(20);
    }
}
