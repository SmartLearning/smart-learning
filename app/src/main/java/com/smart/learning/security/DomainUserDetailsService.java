package com.smart.learning.security;

import com.smart.learning.domain.User;
import com.smart.learning.repository.mongo.UserRepository;
import com.smart.learning.service.errors.ClientSideException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);

    private final UserRepository userRepository;

    public DomainUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(final String username) {
        log.debug("Authenticating {}", username);
        String lowercaseUsername = username.toLowerCase(Locale.ENGLISH);
        Optional<User> userFromDatabase = userRepository.findOneByUsername(lowercaseUsername);
        return userFromDatabase.map(user -> {
            if (!user.isActivated()) {
                throw new ClientSideException(
                    "global.messages.error.not_active_user",
                    Collections.singletonMap("username", lowercaseUsername),
                    HttpStatus.BAD_REQUEST
                );
            }
            List<GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                .collect(Collectors.toList());
            return new org.springframework.security.core.userdetails.User(lowercaseUsername,
                user.getPassword(),
                grantedAuthorities);
        }).orElseThrow(() -> new ClientSideException(
            "global.messages.error.user_not_found",
            Collections.singletonMap("username", lowercaseUsername),
            HttpStatus.BAD_REQUEST
        ));
    }
}
