package com.smart.learning.web.rest;

import com.smart.learning.LearningApplication;
import com.smart.learning.domain.Authority;
import com.smart.learning.domain.User;
import com.smart.learning.repository.mongo.AuthorityRepository;
import com.smart.learning.repository.mongo.UserRepository;
import com.smart.learning.security.AuthoritiesConstants;
import com.smart.learning.service.MailService;
import com.smart.learning.service.UserService;
import com.smart.learning.service.dto.UserDTO;
import com.smart.learning.service.util.RandomUtil;
import com.smart.learning.web.rest.util.TestUtil;
import com.smart.learning.web.rest.vm.KeyAndPasswordVM;
import com.smart.learning.web.rest.vm.ManagedUserVM;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AccountResource REST controller.
 *
 * @see AccountResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearningApplication.class)
public class AccountResourceIntTest {

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private HttpMessageConverter[] httpMessageConverters;

    @Mock
    private MailService mockMailService;

    @Mock
    private UserService mockUserService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private MockMvc restMvc;

    private MockMvc restUserMockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        doNothing().when(mockMailService).sendActivationEmail(anyObject());

        AccountResource accountResource =
            new AccountResource(userRepository, userService, mockMailService);

        AccountResource accountUserMockResource =
            new AccountResource(userRepository, mockUserService, mockMailService);

        this.restMvc = MockMvcBuilders.standaloneSetup(accountResource)
            .setMessageConverters(httpMessageConverters)
            .build();
        this.restUserMockMvc = MockMvcBuilders.standaloneSetup(accountUserMockResource).build();
    }

    @Test
    public void testActivateAccount() throws Exception {
        final String activationKey = "some activation key";
        User user = new User();
        user.setUsername("activate-account");
        user.setEmail("activate-account@example.com");
        user.setPassword(RandomUtil.generatePassword());
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.save(user);

        restMvc.perform(get("/api/activate?key={activationKey}", activationKey))
            .andExpect(status().isOk());

        user = userRepository.findOneByUsername(user.getUsername()).orElse(null);
        assertThat(user.isActivated()).isTrue();
    }

    @Test
    public void testActivateAccountWithWrongKey() throws Exception {
        restMvc.perform(get("/api/activate?key=wrongActivationKey"))
            .andExpect(status().isInternalServerError());
    }

    @Test
    public void testAuthenticatedUser() throws Exception {
        restUserMockMvc.perform(get("/api/authenticate")
            .with(request -> {
                request.setRemoteUser("test");
                return request;
            })
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string("test"));
    }

    @Test
    @WithMockUser("change-password")
    public void testChangePassword() throws Exception {
        User user = new User();
        user.setPassword(RandomUtil.generatePassword());
        user.setUsername("change-password");
        user.setEmail("change-password@example.com");
        userRepository.save(user);

        restMvc.perform(post("/api/account/change_password").content("new password"))
            .andExpect(status().isOk());

        User updatedUser = userRepository.findOneByUsername("change-password").orElse(null);
        assertThat(passwordEncoder.matches("new password", updatedUser.getPassword())).isTrue();
    }

    @Test
    @WithMockUser("change-password-empty")
    public void testChangePasswordEmpty() throws Exception {
        User user = new User();
        user.setPassword(RandomUtil.generatePassword());
        user.setUsername("change-password-empty");
        user.setEmail("change-password-empty@example.com");
        userRepository.save(user);

        restMvc.perform(post("/api/account/change_password").content(StringUtils.EMPTY))
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneByUsername("change-password-empty").orElse(null);
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
    }

    @Test
    @WithMockUser("change-password-too-long")
    public void testChangePasswordTooLong() throws Exception {
        User user = new User();
        user.setPassword(RandomUtil.generatePassword());
        user.setUsername("change-password-too-long");
        user.setEmail("change-password-too-long@example.com");
        userRepository.save(user);

        restMvc.perform(post("/api/account/change_password").content(RandomUtil.generatePassword() + RandomUtil.generatePassword()))
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneByUsername("change-password-too-long").orElse(null);
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
    }

    @Test
    @WithMockUser("change-password-too-small")
    public void testChangePasswordTooSmall() throws Exception {
        User user = new User();
        user.setPassword(RandomUtil.generatePassword());
        user.setUsername("change-password-too-small");
        user.setEmail("change-password-too-small@example.com");
        userRepository.save(user);

        restMvc.perform(post("/api/account/change_password").content("new"))
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneByUsername("change-password-too-small").orElse(null);
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
    }

    @Test
    public void testFinishPasswordReset() throws Exception {
        User user = new User();
        user.setPassword(RandomUtil.generatePassword());
        user.setUsername("finish-password-reset");
        user.setEmail("finish-password-reset@example.com");
        user.setResetDate(Instant.now().plusSeconds(60));
        user.setResetKey("reset key");
        userRepository.save(user);

        KeyAndPasswordVM keyAndPassword = new KeyAndPasswordVM();
        keyAndPassword.setKey(user.getResetKey());
        keyAndPassword.setNewPassword("new password");

        restMvc.perform(
            post("/api/account/reset_password/finish")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(keyAndPassword)))
            .andExpect(status().isOk());

        User updatedUser = userRepository.findOneByUsername(user.getUsername()).orElse(null);
        assertThat(passwordEncoder.matches(keyAndPassword.getNewPassword(), updatedUser.getPassword())).isTrue();
    }

    @Test
    public void testFinishPasswordResetTooSmall() throws Exception {
        User user = new User();
        user.setPassword(RandomUtil.generatePassword());
        user.setUsername("finish-password-reset-too-small");
        user.setEmail("finish-password-reset-too-small@example.com");
        user.setResetDate(Instant.now().plusSeconds(60));
        user.setResetKey("reset key too small");
        userRepository.save(user);

        KeyAndPasswordVM keyAndPassword = new KeyAndPasswordVM();
        keyAndPassword.setKey(user.getResetKey());
        keyAndPassword.setNewPassword("foo");

        restMvc.perform(
            post("/api/account/reset_password/finish")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(keyAndPassword)))
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneByUsername(user.getUsername()).orElse(null);
        assertThat(passwordEncoder.matches(keyAndPassword.getNewPassword(), updatedUser.getPassword())).isFalse();
    }

    @Test
    public void testFinishPasswordResetWrongKey() throws Exception {
        KeyAndPasswordVM keyAndPassword = new KeyAndPasswordVM();
        keyAndPassword.setKey("wrong reset key");
        keyAndPassword.setNewPassword("new password");

        restMvc.perform(
            post("/api/account/reset_password/finish")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(keyAndPassword)))
            .andExpect(status().isInternalServerError());
    }

    @Test
    public void testGetExistingAccount() throws Exception {
        Set<Authority> authorities = new HashSet<>();
        Authority authority = new Authority();
        authority.setName(AuthoritiesConstants.ADMIN);
        authorities.add(authority);

        User user = new User();
        user.setUsername("test");
        user.setFirstName("john");
        user.setLastName("doe");
        user.setEmail("john.doe@app.com");
        user.setImageUrl("http://placehold.it/50x50");
        user.setLangKey("en");
        user.setAuthorities(authorities);
        when(mockUserService.getUserWithAuthorities()).thenReturn(user);

        restUserMockMvc.perform(get("/api/account")
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.username").value("test"))
            .andExpect(jsonPath("$.firstName").value("john"))
            .andExpect(jsonPath("$.lastName").value("doe"))
            .andExpect(jsonPath("$.email").value("john.doe@app.com"))
            .andExpect(jsonPath("$.imageUrl").value("http://placehold.it/50x50"))
            .andExpect(jsonPath("$.langKey").value("en"))
            .andExpect(jsonPath("$.authorities").value(AuthoritiesConstants.ADMIN));
    }

    @Test
    public void testGetUnknownAccount() throws Exception {
        when(mockUserService.getUserWithAuthorities()).thenReturn(null);

        restUserMockMvc.perform(get("/api/account")
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isInternalServerError());
    }

    @Test
    public void testNonAuthenticatedUser() throws Exception {
        restUserMockMvc.perform(get("/api/authenticate")
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string(""));
    }

    @Test
    public void testRegisterAdminIsIgnored() throws Exception {
        ManagedUserVM validUser = new ManagedUserVM(
            null,                   // id
            "badguy",               // username
            "password",             // password
            "Bad",                  // firstName
            "Guy",                  // lastName
            "badguy@example.com",   // email
            true,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.ADMIN)));

        restMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(validUser)))
            .andExpect(status().isCreated());

        Optional<User> userDup = userRepository.findOneByUsername("badguy");
        assertThat(userDup.isPresent()).isTrue();
        assertThat(userDup.get().getAuthorities()).hasSize(1)
            .containsExactly(authorityRepository.findOne(AuthoritiesConstants.USER));
    }

    @Test
    public void testRegisterDuplicateEmail() throws Exception {
        // Good
        ManagedUserVM validUser = new ManagedUserVM(
            null,                   // id
            "john",                 // username
            "password",             // password
            "John",                 // firstName
            "Doe",                  // lastName
            "john@example.com",     // email
            true,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)));

        // Duplicate email, different username
        ManagedUserVM duplicatedUser = new ManagedUserVM(validUser.getId(), "johnjr", validUser.getPassword(), validUser.getUsername(), validUser.getLastName(),
            validUser.getEmail(), true, validUser.getImageUrl(), validUser.getLangKey(), validUser.getCreatedBy(), validUser.getCreatedAt(), validUser.getModifiedBy(), validUser.getModifiedAt(), validUser.getAuthorities());

        // Good user
        restMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(validUser)))
            .andExpect(status().isCreated());

        // Duplicate email
        restMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(duplicatedUser)))
            .andExpect(status().is4xxClientError());

        Optional<User> userDup = userRepository.findOneByUsername("johnjr");
        assertThat(userDup.isPresent()).isFalse();
    }

    @Test
    public void testRegisterDuplicateUsername() throws Exception {
        // Good
        ManagedUserVM validUser = new ManagedUserVM(
            null,                   // id
            "alice",                // username
            "password",             // password
            "Alice",                // firstName
            "Something",            // lastName
            "alice@example.com",    // email
            true,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)));

        // Duplicate username, different email
        ManagedUserVM duplicatedUser = new ManagedUserVM(validUser.getId(), validUser.getUsername(), validUser.getPassword(), validUser.getFirstName(), validUser.getLastName(),
            "alicejr@example.com", true, validUser.getImageUrl(), validUser.getLangKey(), validUser.getCreatedBy(), validUser.getCreatedAt(), validUser.getModifiedBy(), validUser.getModifiedAt(), validUser.getAuthorities());

        // Good user
        restMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(validUser)))
            .andExpect(status().isCreated());

        // Duplicate username
        restMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(duplicatedUser)))
            .andExpect(status().is4xxClientError());

        Optional<User> userDup = userRepository.findOneByEmail("alicejr@example.com");
        assertThat(userDup.isPresent()).isFalse();
    }

    @Test
    public void testRegisterInvalidEmail() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM(
            null,               // id
            "bob",              // username
            "password",         // password
            "Bob",              // firstName
            "Green",            // lastName
            "invalid",          // email <-- invalid
            true,               // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)));

        restUserMockMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(invalidUser)))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneByUsername("bob");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    public void testRegisterInvalidPassword() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM(
            null,               // id
            "bob",              // username
            "123",              // password with only 3 digits
            "Bob",              // firstName
            "Green",            // lastName
            "bob@example.com",  // email
            true,               // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)));

        restUserMockMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(invalidUser)))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneByUsername("bob");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    public void testRegisterInvalidUsername() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM(
            null,                   // id
            "funky-log!n",          // username <-- invalid
            "password",             // password
            "Funky",                // firstName
            "One",                  // lastName
            "funky@example.com",    // email
            true,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)));

        restUserMockMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(invalidUser)))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneByEmail("funky@example.com");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    public void testRegisterNullPassword() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM(
            null,               // id
            "bob",              // username
            null,               // invalid null password
            "Bob",              // firstName
            "Green",            // lastName
            "bob@example.com",  // email
            true,               // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)));

        restUserMockMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(invalidUser)))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneByUsername("bob");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    public void testRegisterValid() throws Exception {
        ManagedUserVM validUser = new ManagedUserVM(
            null,                   // id
            "joe",                  // username
            "password",             // password
            "Joe",                  // firstName
            "Shmoe",                // lastName
            "joe@example.com",      // email
            true,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)));

        restMvc.perform(
            post("/api/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(validUser)))
            .andExpect(status().isCreated());

        Optional<User> user = userRepository.findOneByUsername("joe");
        assertThat(user.isPresent()).isTrue();
    }

    @Test
    public void testRequestPasswordReset() throws Exception {
        User user = new User();
        user.setPassword(RandomUtil.generatePassword());
        user.setActivated(true);
        user.setUsername("password-reset");
        user.setEmail("password-reset@example.com");
        userRepository.save(user);

        restMvc.perform(post("/api/account/reset_password/init")
            .content("password-reset@example.com"))
            .andExpect(status().isOk());
    }

    @Test
    public void testRequestPasswordResetWrongEmail() throws Exception {
        restMvc.perform(
            post("/api/account/reset_password/init")
                .content("password-reset-wrong-email@example.com"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser("save-account")
    public void testSaveAccount() throws Exception {
        User user = new User();
        user.setUsername("save-account");
        user.setEmail("save-account@example.com");
        user.setPassword(RandomUtil.generatePassword());
        user.setActivated(true);

        userRepository.save(user);

        UserDTO userDTO = new UserDTO(
            null,                   // id
            "not-used",          // username
            "firstname",                // firstName
            "lastname",                  // lastName
            "save-account@example.com",    // email
            false,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.ADMIN))
        );

        restMvc.perform(
            post("/api/account")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isOk());

        User updatedUser = userRepository.findOneByUsername(user.getUsername()).orElse(null);
        assertThat(updatedUser.getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(updatedUser.getLastName()).isEqualTo(userDTO.getLastName());
        assertThat(updatedUser.getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(updatedUser.getLangKey()).isEqualTo(userDTO.getLangKey());
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
        assertThat(updatedUser.getImageUrl()).isEqualTo(userDTO.getImageUrl());
        assertThat(updatedUser.isActivated()).isEqualTo(true);
        assertThat(updatedUser.getAuthorities()).isEmpty();
    }

    @Test
    @WithMockUser("save-existing-email")
    public void testSaveExistingEmail() throws Exception {
        User user = new User();
        user.setUsername("save-existing-email");
        user.setEmail("save-existing-email@example.com");
        user.setPassword(RandomUtil.generatePassword());
        user.setActivated(true);

        userRepository.save(user);

        User anotherUser = new User();
        anotherUser.setUsername("save-existing-email2");
        anotherUser.setEmail("save-existing-email2@example.com");
        anotherUser.setPassword(RandomUtil.generatePassword());
        anotherUser.setActivated(true);

        userRepository.save(anotherUser);

        UserDTO userDTO = new UserDTO(
            null,                   // id
            "not-used",          // username
            "firstname",                // firstName
            "lastname",                  // lastName
            "save-existing-email2@example.com",    // email
            false,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.ADMIN))
        );

        restMvc.perform(
            post("/api/account")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneByUsername("save-existing-email").orElse(null);
        assertThat(updatedUser.getEmail()).isEqualTo("save-existing-email@example.com");
    }

    @Test
    @WithMockUser("save-existing-email-and-username")
    public void testSaveExistingEmailAndUsername() throws Exception {
        User user = new User();
        user.setUsername("save-existing-email-and-username");
        user.setEmail("save-existing-email-and-username@example.com");
        user.setPassword(RandomUtil.generatePassword());
        user.setActivated(true);

        userRepository.save(user);

        UserDTO userDTO = new UserDTO(
            null,                   // id
            "not-used",          // username
            "firstname",                // firstName
            "lastname",                  // lastName
            "save-existing-email-and-username@example.com",    // email
            false,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.ADMIN))
        );

        restMvc.perform(
            post("/api/account")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isOk());

        User updatedUser = userRepository.findOneByUsername("save-existing-email-and-username").orElse(null);
        assertThat(updatedUser.getEmail()).isEqualTo("save-existing-email-and-username@example.com");
    }

    @Test
    @WithMockUser("save-invalid-email")
    public void testSaveInvalidEmail() throws Exception {
        User user = new User();
        user.setUsername("save-invalid-email");
        user.setEmail("save-invalid-email@example.com");
        user.setPassword(RandomUtil.generatePassword());
        user.setActivated(true);

        userRepository.save(user);

        UserDTO userDTO = new UserDTO(
            null,                   // id
            "not-used",          // username
            "firstname",                // firstName
            "lastname",                  // lastName
            "invalid email",    // email
            false,                   // activated
            "http://placehold.it/50x50", //imageUrl
            "en",                   // langKey
            null,                   // createdBy
            null,                   // createdDate
            null,                   // lastModifiedBy
            null,                   // lastModifiedDate
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.ADMIN))
        );

        restMvc.perform(
            post("/api/account")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isBadRequest());

        assertThat(userRepository.findOneByEmail("invalid email")).isNotPresent();
    }
}