package com.smart.learning.web.rest;

import com.smart.learning.LearningApplication;
import com.smart.learning.domain.Authority;
import com.smart.learning.domain.User;
import com.smart.learning.repository.mongo.UserRepository;
import com.smart.learning.security.AuthoritiesConstants;
import com.smart.learning.service.MailService;
import com.smart.learning.service.UserService;
import com.smart.learning.service.dto.UserDTO;
import com.smart.learning.service.mapper.UserMapper;
import com.smart.learning.service.util.RandomUtil;
import com.smart.learning.web.rest.errors.ExceptionTranslator;
import com.smart.learning.web.rest.util.TestUtil;
import com.smart.learning.web.rest.vm.ManagedUserVM;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UserResource REST controller.
 *
 * @see UserResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearningApplication.class)
public class UserResourceIntTest {

    private static final String DEFAULT_EMAIL = "johndoe@localhost";

    private static final String DEFAULT_FIRSTNAME = "john";

    private static final String DEFAULT_ID = "id1";

    private static final String DEFAULT_IMAGEURL = "http://placehold.it/50x50";

    private static final String DEFAULT_LANGKEY = "en";

    private static final String DEFAULT_LASTNAME = "doe";

    private static final String DEFAULT_PASSWORD = "passjohndoe";

    private static final String DEFAULT_USERNAME = "johndoe";

    private static final String UPDATED_EMAIL = "app@localhost";

    private static final String UPDATED_FIRSTNAME = "appFirstName";

    private static final String UPDATED_IMAGEURL = "http://placehold.it/40x40";

    private static final String UPDATED_LANGKEY = "fr";

    private static final String UPDATED_LASTNAME = "appLastName";

    private static final String UPDATED_PASSWORD = "passapp";

    private static final String UPDATED_USERNAME = "app";

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    @Qualifier("mappingJackson2HttpMessageConverter")
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private MailService mailService;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restUserMockMvc;

    private User user;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    /**
     * Create a User.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which has a required relationship to the User entity.
     */
    public static User createEntity() {
        User user = new User();
        user.setUsername(DEFAULT_USERNAME);
        user.setPassword(RandomUtil.generatePassword());
        user.setActivated(true);
        user.setEmail(DEFAULT_EMAIL);
        user.setFirstName(DEFAULT_FIRSTNAME);
        user.setLastName(DEFAULT_LASTNAME);
        user.setImageUrl(DEFAULT_IMAGEURL);
        user.setLangKey(DEFAULT_LANGKEY);
        return user;
    }

    @Test
    public void createUser() throws Exception {
        int databaseSizeBeforeCreate = userRepository.findAll().size();

        // Create the User
        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");

        ManagedUserVM managedUserVM = new ManagedUserVM(DEFAULT_PASSWORD);
        managedUserVM.setUsername(DEFAULT_USERNAME)
            .setFirstName(DEFAULT_FIRSTNAME)
            .setLastName(DEFAULT_LASTNAME)
            .setEmail(DEFAULT_EMAIL)
            .setActivated(true)
            .setImageUrl(DEFAULT_IMAGEURL)
            .setLangKey(DEFAULT_LANGKEY)
            .setAuthorities(authorities);

        restUserMockMvc.perform(post("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isCreated());

        // Validate the User in the database
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate + 1);
        User testUser = userList.get(userList.size() - 1);
        assertThat(testUser.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testUser.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(testUser.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(testUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testUser.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(testUser.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    public void createUserWithExistingEmail() throws Exception {
        // Initialize the database
        userRepository.save(user);
        int databaseSizeBeforeCreate = userRepository.findAll().size();

        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");

        ManagedUserVM managedUserVM = new ManagedUserVM(DEFAULT_PASSWORD);
        managedUserVM.setUsername("anotherusername")
            .setFirstName(DEFAULT_FIRSTNAME)
            .setLastName(DEFAULT_LASTNAME)
            .setEmail(DEFAULT_EMAIL) // this email should already be used
            .setActivated(true)
            .setImageUrl(DEFAULT_IMAGEURL)
            .setLangKey(DEFAULT_LANGKEY)
            .setAuthorities(authorities);

        // Create the User
        restUserMockMvc.perform(post("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isBadRequest());

        // Validate the User in the database
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void createUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userRepository.findAll().size();

        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");

        ManagedUserVM managedUserVM = new ManagedUserVM(DEFAULT_PASSWORD);
        managedUserVM.setId("1L")
            .setUsername(DEFAULT_USERNAME)
            .setFirstName(DEFAULT_FIRSTNAME)
            .setLastName(DEFAULT_LASTNAME)
            .setEmail(DEFAULT_EMAIL)
            .setActivated(true)
            .setImageUrl(DEFAULT_IMAGEURL)
            .setLangKey(DEFAULT_LANGKEY)
            .setAuthorities(authorities);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserMockMvc.perform(post("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isBadRequest());

        // Validate the User in the database
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void createUserWithExistingUsername() throws Exception {
        // Initialize the database
        userRepository.save(user);
        int databaseSizeBeforeCreate = userRepository.findAll().size();

        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");

        ManagedUserVM managedUserVM = new ManagedUserVM(DEFAULT_PASSWORD);
        managedUserVM.setUsername(DEFAULT_USERNAME)
            .setFirstName(DEFAULT_FIRSTNAME)
            .setLastName(DEFAULT_LASTNAME)
            .setEmail("anothermail@localhost")
            .setActivated(true)
            .setImageUrl(DEFAULT_IMAGEURL)
            .setLangKey(DEFAULT_LANGKEY)
            .setAuthorities(authorities);

        // Create the User
        restUserMockMvc.perform(post("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isBadRequest());

        // Validate the User in the database
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void deleteUser() throws Exception {
        // Initialize the database
        userRepository.save(user);
        int databaseSizeBeforeDelete = userRepository.findAll().size();

        // Delete the user
        restUserMockMvc.perform(delete("/api/users/{username}", user.getUsername())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void getAllAuthorities() throws Exception {
        restUserMockMvc.perform(get("/api/users/authorities")
            .accept(TestUtil.APPLICATION_JSON_UTF8)
            .contentType(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").value(containsInAnyOrder("ROLE_USER", "ROLE_ADMIN")));
    }

    @Test
    public void getAllUsers() throws Exception {
        // Initialize the database
        userRepository.save(user);

        // Get all the users
        restUserMockMvc.perform(get("/api/users")
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRSTNAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LASTNAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGEURL)))
            .andExpect(jsonPath("$.[*].langKey").value(hasItem(DEFAULT_LANGKEY)));
    }

    @Test
    public void getNonExistingUser() throws Exception {
        restUserMockMvc.perform(get("/api/users/unknown"))
            .andExpect(status().isNotFound());
    }

    @Test
    public void getUser() throws Exception {
        // Initialize the database
        userRepository.save(user);

        // Get the user
        restUserMockMvc.perform(get("/api/users/{username}", user.getUsername()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.username").value(user.getUsername()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRSTNAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LASTNAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGEURL))
            .andExpect(jsonPath("$.langKey").value(DEFAULT_LANGKEY));
    }

    @Before
    public void initTest() {
        userRepository.deleteAll();
        user = createEntity();
    }

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        UserResource userResource = new UserResource(userRepository, mailService, userService);
        this.restUserMockMvc = MockMvcBuilders.standaloneSetup(userResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter)
            .build();
    }

    @Test
    public void testAuthorityEquals() throws Exception {
        Authority authorityA = new Authority();
        assertThat(authorityA).isEqualTo(authorityA);
        assertThat(authorityA).isNotEqualTo(null);
        assertThat(authorityA).isNotEqualTo(new Object());
        assertThat(authorityA.hashCode()).isEqualTo(0);
        assertThat(authorityA.toString()).isNotNull();

        Authority authorityB = new Authority();
        assertThat(authorityA).isEqualTo(authorityB);

        authorityB.setName(AuthoritiesConstants.ADMIN);
        assertThat(authorityA).isNotEqualTo(authorityB);

        authorityA.setName(AuthoritiesConstants.USER);
        assertThat(authorityA).isNotEqualTo(authorityB);

        authorityB.setName(AuthoritiesConstants.USER);
        assertThat(authorityA).isEqualTo(authorityB);
        assertThat(authorityA.hashCode()).isEqualTo(authorityB.hashCode());
    }

    @Test
    public void testUserDTOtoUser() {
        UserDTO userDTO = new UserDTO()
            .setId(DEFAULT_ID)
            .setUsername(DEFAULT_USERNAME)
            .setFirstName(DEFAULT_FIRSTNAME)
            .setLastName(DEFAULT_LASTNAME)
            .setEmail(DEFAULT_EMAIL)
            .setActivated(true)
            .setImageUrl(DEFAULT_IMAGEURL)
            .setLangKey(DEFAULT_LANGKEY)
            .setCreatedBy(DEFAULT_USERNAME)
            .setModifiedBy(DEFAULT_USERNAME)
            .setAuthorities(Stream.of(AuthoritiesConstants.USER).collect(Collectors.toSet()));

        User user = userMapper.userDTOToUser(userDTO);
        assertThat(user.getId()).isEqualTo(DEFAULT_ID);
        assertThat(user.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(user.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(user.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(user.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(user.isActivated()).isEqualTo(true);
        assertThat(user.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(user.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
        assertThat(user.getCreatedBy()).isNull();
        assertThat(user.getCreatedAt()).isNotNull();
        assertThat(user.getModifiedBy()).isNull();
        assertThat(user.getModifiedAt()).isNotNull();
        assertThat(user.getAuthorities()).extracting("name").containsExactly(AuthoritiesConstants.USER);
    }

    @Test
    public void testUserEquals() {
        User userA = new User();
        assertThat(userA).isEqualTo(userA);
        assertThat(userA).isNotEqualTo(null);
        assertThat(userA).isNotEqualTo(new Object());
        assertThat(userA.toString()).isNotNull();

        userA.setUsername("AAA");
        User userB = new User();
        userB.setUsername("BBB");
        assertThat(userA).isNotEqualTo(userB);

        userB.setUsername("AAA");
        assertThat(userA).isEqualTo(userB);
        assertThat(userA.hashCode()).isEqualTo(userB.hashCode());
    }

    @Test
    public void testUserFromId() {
        assertThat(userMapper.userFromId(DEFAULT_ID).getId()).isEqualTo(DEFAULT_ID);
        assertThat(userMapper.userFromId(null)).isNull();
    }

    @Test
    public void testUserToUserDTO() {
        user.setId(DEFAULT_ID);
        user.setCreatedBy(DEFAULT_USERNAME);
        user.setCreatedAt(Instant.now());
        user.setModifiedBy(DEFAULT_USERNAME);
        user.setModifiedAt(Instant.now());

        Set<Authority> authorities = new HashSet<>();
        Authority authority = new Authority();
        authority.setName(AuthoritiesConstants.USER);
        authorities.add(authority);
        user.setAuthorities(authorities);

        UserDTO userDTO = userMapper.userToUserDTO(user);

        assertThat(userDTO.getId()).isEqualTo(DEFAULT_ID);
        assertThat(userDTO.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(userDTO.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(userDTO.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(userDTO.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(userDTO.isActivated()).isEqualTo(true);
        assertThat(userDTO.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(userDTO.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
        assertThat(userDTO.getCreatedBy()).isEqualTo(DEFAULT_USERNAME);
        assertThat(userDTO.getCreatedAt()).isEqualTo(user.getCreatedAt());
        assertThat(userDTO.getModifiedBy()).isEqualTo(DEFAULT_USERNAME);
        assertThat(userDTO.getModifiedAt()).isEqualTo(user.getModifiedAt());
        assertThat(userDTO.getAuthorities()).containsExactly(AuthoritiesConstants.USER);
        assertThat(userDTO.toString()).isNotNull();
    }

    @Test
    public void updateUser() throws Exception {
        // Initialize the database
        userRepository.save(user);
        int databaseSizeBeforeUpdate = userRepository.findAll().size();

        // Update the user
        User updatedUser = userRepository.findOne(user.getId());

        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");

        ManagedUserVM managedUserVM = new ManagedUserVM(UPDATED_PASSWORD);
        managedUserVM.setId(updatedUser.getId())
            .setUsername(updatedUser.getUsername())
            .setFirstName(UPDATED_FIRSTNAME)
            .setLastName(UPDATED_LASTNAME)
            .setEmail(UPDATED_EMAIL)
            .setActivated(updatedUser.isActivated())
            .setImageUrl(UPDATED_IMAGEURL)
            .setLangKey(UPDATED_LANGKEY)
            .setCreatedBy(updatedUser.getCreatedBy())
            .setCreatedAt(updatedUser.getCreatedAt())
            .setModifiedBy(updatedUser.getModifiedBy())
            .setModifiedAt(updatedUser.getModifiedAt())
            .setAuthorities(authorities);

        restUserMockMvc.perform(put("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isOk());

        // Validate the User in the database
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeUpdate);
        User testUser = userList.get(userList.size() - 1);
        assertThat(testUser.getFirstName()).isEqualTo(UPDATED_FIRSTNAME);
        assertThat(testUser.getLastName()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUser.getImageUrl()).isEqualTo(UPDATED_IMAGEURL);
        assertThat(testUser.getLangKey()).isEqualTo(UPDATED_LANGKEY);
    }

    @Test
    public void updateUserExistingEmail() throws Exception {
        // Initialize the database with 2 users
        userRepository.save(user);

        User anotherUser = new User();
        anotherUser.setUsername("app");
        anotherUser.setPassword(RandomUtil.generatePassword());
        anotherUser.setActivated(true);
        anotherUser.setEmail("app@localhost");
        anotherUser.setFirstName("java");
        anotherUser.setLastName("hipster");
        anotherUser.setImageUrl("");
        anotherUser.setLangKey("en");
        userRepository.save(anotherUser);

        // Update the user
        User updatedUser = userRepository.findOne(user.getId());

        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");

        ManagedUserVM managedUserVM = new ManagedUserVM(updatedUser.getPassword());
        managedUserVM.setId(updatedUser.getId())
            .setUsername("app")
            .setFirstName(updatedUser.getFirstName())
            .setLastName(updatedUser.getLastName())
            .setEmail("app@localhost")
            .setActivated(updatedUser.isActivated())
            .setImageUrl(updatedUser.getImageUrl())
            .setLangKey(updatedUser.getLangKey())
            .setCreatedBy(updatedUser.getCreatedBy())
            .setCreatedAt(updatedUser.getCreatedAt())
            .setModifiedBy(updatedUser.getModifiedBy())
            .setModifiedAt(updatedUser.getModifiedAt())
            .setAuthorities(authorities);

        restUserMockMvc.perform(put("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isBadRequest());
    }

    @Test
    public void updateUserExistingUsername() throws Exception {
        // Initialize the database
        userRepository.save(user);

        User anotherUser = new User();
        anotherUser.setUsername("app");
        anotherUser.setPassword(RandomUtil.generatePassword());
        anotherUser.setActivated(true);
        anotherUser.setEmail("app@localhost");
        anotherUser.setFirstName("java");
        anotherUser.setLastName("hipster");
        anotherUser.setImageUrl("");
        anotherUser.setLangKey("en");
        userRepository.save(anotherUser);

        // Update the user
        User updatedUser = userRepository.findOne(user.getId());

        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");

        ManagedUserVM managedUserVM = new ManagedUserVM(updatedUser.getPassword());
        managedUserVM.setId(updatedUser.getId())
            .setUsername("app")
            .setFirstName(updatedUser.getFirstName())
            .setLastName(updatedUser.getLastName())
            .setEmail(updatedUser.getEmail())
            .setActivated(updatedUser.isActivated())
            .setImageUrl(updatedUser.getImageUrl())
            .setLangKey(updatedUser.getLangKey())
            .setCreatedBy(updatedUser.getCreatedBy())
            .setCreatedAt(updatedUser.getCreatedAt())
            .setModifiedBy(updatedUser.getModifiedBy())
            .setModifiedAt(updatedUser.getModifiedAt())
            .setAuthorities(authorities);

        restUserMockMvc.perform(put("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isBadRequest());
    }

    @Test
    public void updateUserUsername() throws Exception {
        // Initialize the database
        userRepository.save(user);
        int databaseSizeBeforeUpdate = userRepository.findAll().size();

        // Update the user
        User updatedUser = userRepository.findOne(user.getId());

        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_USER");
        ManagedUserVM managedUserVM = new ManagedUserVM(UPDATED_PASSWORD);
        managedUserVM.setId(updatedUser.getId())
            .setUsername(UPDATED_USERNAME)
            .setFirstName(UPDATED_FIRSTNAME)
            .setLastName(UPDATED_LASTNAME)
            .setEmail(UPDATED_EMAIL)
            .setActivated(updatedUser.isActivated())
            .setImageUrl(UPDATED_IMAGEURL)
            .setLangKey(UPDATED_LANGKEY)
            .setCreatedBy(updatedUser.getCreatedBy())
            .setCreatedAt(updatedUser.getCreatedAt())
            .setModifiedBy(updatedUser.getModifiedBy())
            .setModifiedAt(updatedUser.getModifiedAt())
            .setAuthorities(authorities);

        restUserMockMvc.perform(put("/api/users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
            .andExpect(status().isOk());

        // Validate the User in the database
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeUpdate);
        User testUser = userList.get(userList.size() - 1);
        assertThat(testUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testUser.getFirstName()).isEqualTo(UPDATED_FIRSTNAME);
        assertThat(testUser.getLastName()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUser.getImageUrl()).isEqualTo(UPDATED_IMAGEURL);
        assertThat(testUser.getLangKey()).isEqualTo(UPDATED_LANGKEY);
    }

}
