package com.smart.learning.config;

/**
 * Application constants.
 */
public final class Constants {

    public static final String ANONYMOUS_USER = "anonymous";

    public static final String SYSTEM_ACCOUNT = "system";

    public static final String USERNAME_PATTERN = "^[_.A-Za-z0-9-]*$";

    private Constants() {
    }

    public final class HeaderMessage {

        public static final String MESSAGE_CREATED = ".messages.created";

        public static final String MESSAGE_DELETED = ".messages.deleted";

        public static final String MESSAGE_UPDATED = ".messages.updated";

        private HeaderMessage() {
        }
    }

    public final class Profile {

        public static final String SPRING_PROFILE_DEVELOPMENT = "dev";

        public static final String SPRING_PROFILE_PRODUCTION = "prod";

        private Profile() {
        }
    }
}
