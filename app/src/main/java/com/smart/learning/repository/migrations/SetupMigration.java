package com.smart.learning.repository.migrations;

import com.github.mongobee.changeset.ChangeLog;
import com.github.mongobee.changeset.ChangeSet;
import com.smart.learning.domain.Authority;
import com.smart.learning.domain.User;
import com.smart.learning.security.AuthoritiesConstants;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.Instant;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

@ChangeLog(order = "0001")
public class SetupMigration {

    @ChangeSet(order = "01", author = "navid", id = "01-addAuthorities")
    public void addAuthorities(MongoTemplate mongoTemplate) {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        Authority userAuthority = new Authority();
        userAuthority.setName(AuthoritiesConstants.USER);
        mongoTemplate.save(adminAuthority);
        mongoTemplate.save(userAuthority);
    }

    @ChangeSet(order = "02", author = "navid", id = "02-addUsers")
    public void addUsers(MongoTemplate mongoTemplate) {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        Authority userAuthority = new Authority();
        userAuthority.setName(AuthoritiesConstants.USER);

        User adminUser = new User();
        adminUser.setId("user-1");
        adminUser.setUsername("admin");
        adminUser.setPassword("$2a$10$igKgV9LaKsSuREyLgmyef.dG2r2QSW0CoPHEque54SCaGwDSRB/LC");
        adminUser.setEmail("admin@learning");
        adminUser.setLastName("Administrator");
        adminUser.setLangKey("en");
        adminUser.setActivated(true);
        adminUser.setCreatedBy("system");
        adminUser.setCreatedAt(Instant.now());
        adminUser.getAuthorities().add(adminAuthority);
        adminUser.getAuthorities().add(userAuthority);
        mongoTemplate.save(adminUser);

        User userUser = new User();
        userUser.setId("user-2");
        userUser.setUsername("user");
        userUser.setPassword("$2a$10$4NHWANsnOMd39vw0kcnMG.TAZpwlRsiHWm.7ddPjDtsRl4wvcfaU.");
        userUser.setActivated(true);
        userUser.setEmail("user@learning");
        adminUser.setLastName("User");
        userUser.setLangKey("en");
        userUser.setCreatedBy("system");
        userUser.setCreatedAt(Instant.now());
        userUser.getAuthorities().add(userAuthority);
        mongoTemplate.save(userUser);
    }
}
