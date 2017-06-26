package com.smart.learning.web.rest;

import com.smart.learning.LearningApplication;
import com.smart.learning.domain.User;
import com.smart.learning.repository.mongo.UserRepository;
import com.smart.learning.security.jwt.TokenProvider;
import com.smart.learning.web.rest.util.TestUtil;
import com.smart.learning.web.rest.vm.LoginVM;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test class for the UserJWTController REST controller.
 *
 * @see UserJWTController
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearningApplication.class)
public class UserJWTControllerIntTest {

    @Autowired
    private AuthenticationManager authenticationManager;

    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Before
    public void setup() {
        UserJWTController userJWTController = new UserJWTController(tokenProvider, authenticationManager);
        this.mockMvc = MockMvcBuilders.standaloneSetup(userJWTController)
            .build();
    }

    @Test
    public void testAuthorize() throws Exception {
        User user = new User();
        user.setUsername("user-jwt-controller");
        user.setEmail("user-jwt-controller@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        userRepository.save(user);

        LoginVM username = new LoginVM();
        username.setUsername("user-jwt-controller");
        username.setPassword("test");
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(username)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isString())
            .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    public void testAuthorizeFails() throws Exception {
        LoginVM username = new LoginVM();
        username.setUsername("wrong-user");
        username.setPassword("wrong password");
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(username)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    public void testAuthorizeWithRememberMe() throws Exception {
        User user = new User();
        user.setUsername("user-jwt-controller-remember-me");
        user.setEmail("user-jwt-controller-remember-me@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        userRepository.save(user);

        LoginVM username = new LoginVM();
        username.setUsername("user-jwt-controller-remember-me");
        username.setPassword("test");
        username.setRememberMe(true);
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(username)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isString())
            .andExpect(jsonPath("$.token").isNotEmpty());
    }
}
