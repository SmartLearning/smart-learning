package com.smart.learning.repository.mongo;

import com.smart.learning.domain.User;
import com.smart.learning.repository.util.BaseMongoDBRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the User entity.
 */
public interface UserRepository extends BaseMongoDBRepository<User, String> {

    List<User> findAllByActivatedIsFalseAndCreatedAtBefore(Instant dateTime);

    Page<User> findAllByUsernameNot(Pageable pageable, String username);

    Optional<User> findOneByActivationKey(String activationKey);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByUsername(String username);
}
