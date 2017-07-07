package com.smart.learning.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smart.learning.config.Constants;
import com.smart.learning.domain.User;
import com.smart.learning.repository.mongo.UserRepository;
import com.smart.learning.security.AuthoritiesConstants;
import com.smart.learning.service.MailService;
import com.smart.learning.service.UserService;
import com.smart.learning.service.dto.UserDTO;
import com.smart.learning.web.rest.util.CrudResource;
import com.smart.learning.web.rest.util.HeaderUtil;
import com.smart.learning.web.rest.util.PaginationUtil;
import com.smart.learning.web.rest.util.ResponseUtil;
import com.smart.learning.web.rest.vm.ManagedUserVM;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing users.
 * <p>
 * This class accesses the User entity, and needs to fetch its collection of authorities.
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority,
 * and send everything to the client side: there would be no View Model and DTO, a lot less code, and an outer-join
 * which would be good for performance.
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </ul>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this case.
 */
@RestController
@RequestMapping("/api")
public class UserResource {

    private static final String ENTITY_NAME = "user";

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    private final MailService mailService;

    private final UserRepository userRepository;

    private final UserService userService;

    public UserResource(UserRepository userRepository, MailService mailService, UserService userService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.userService = userService;
    }

    /**
     * POST  /users  : Creates a new user.
     * <p>
     * Creates a new user if the username and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     *
     * @param managedUserVM the user to create
     * @return the ResponseEntity with status 201 (Created) and with body the new user, or with status 400 (Bad Request) if the username or email is already in use
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @Timed
    @PostMapping("/users")
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity createUser(@Valid @RequestBody ManagedUserVM managedUserVM) throws URISyntaxException {
        log.debug("REST request to save User : {}", managedUserVM);

        if (managedUserVM.getId() != null) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "error.id_exists"))
                .body(null);
            // Lowercase the user username before comparing with database
        } else if (userRepository.findOneByUsername(managedUserVM.getUsername().toLowerCase()).isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(CrudResource.GLOBAL_NAME, "messages.error.user_exists"))
                .body(null);
        } else if (userRepository.findOneByEmail(managedUserVM.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(CrudResource.GLOBAL_NAME, "messages.error.email_exists"))
                .body(null);
        } else {
            User newUser = userService.createUser(managedUserVM);
            mailService.sendCreationEmail(newUser);
            return ResponseEntity.created(new URI("/api/users/" + newUser.getUsername()))
                .headers(HeaderUtil.createEntityCreationAlert(CrudResource.GLOBAL_NAME, newUser.getUsername()))
                .body(newUser);
        }
    }

    /**
     * DELETE /users/:username : delete the "username" User.
     *
     * @param username the username of the user to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    @DeleteMapping("/users/{username:" + Constants.USERNAME_PATTERN + "}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        log.debug("REST request to delete User: {}", username);
        userService.deleteUser(username);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(CrudResource.GLOBAL_NAME, username)).build();
    }

    /**
     * GET  /users : get all users.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and with body all users
     */
    @Timed
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@ApiParam Pageable pageable) {
        final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /users/:username : get the "username" user.
     *
     * @param username the username of the user to find
     * @return the ResponseEntity with status 200 (OK) and with body the "username" user, or with status 404 (Not Found)
     */
    @Timed
    @GetMapping("/users/{username:" + Constants.USERNAME_PATTERN + "}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        log.debug("REST request to get User : {}", username);
        return ResponseUtil.wrapOrNotFound(
            userService.getUserWithAuthorities(username).map(UserDTO::new));
    }

    /**
     * PUT  /users : Updates an existing User.
     *
     * @param managedUserVM the user to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated user,
     * or with status 400 (Bad Request) if the username or email is already in use,
     * or with status 500 (Internal Server Error) if the user couldn't be updated
     */
    @Timed
    @PutMapping("/users")
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<UserDTO> updateUser(@Valid @RequestBody ManagedUserVM managedUserVM) {
        log.debug("REST request to update User : {}", managedUserVM);
        Optional<User> existingUser = userRepository.findOneByEmail(managedUserVM.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(managedUserVM.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(CrudResource.GLOBAL_NAME, "messages.error.email_exists")).body(null);
        }
        existingUser = userRepository.findOneByUsername(managedUserVM.getUsername().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(managedUserVM.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(CrudResource.GLOBAL_NAME, "messages.error.user_exists")).body(null);
        }
        Optional<UserDTO> updatedUser = userService.updateUser(managedUserVM);

        return ResponseUtil.wrapOrNotFound(
            updatedUser,
            HeaderUtil.createAlert(
                "userManagement.updated",
                managedUserVM.getUsername()
            )
        );
    }

    /**
     * @return a string list of the all of the roles
     */
    @Timed
    @GetMapping("/users/authorities")
    @Secured(AuthoritiesConstants.ADMIN)
    public List<String> getAuthorities() {
        return userService.getAuthorities();
    }
}
