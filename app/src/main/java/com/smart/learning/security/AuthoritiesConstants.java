package com.smart.learning.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String TEST_ADMIN = "ADMIN";

    public static final String TEST_ANONYMOUS = "ANONYMOUS";

    public static final String TEST_USER = "USER";

    public static final String USER = "ROLE_USER";

    private AuthoritiesConstants() {
    }
}
