package com.smart.learning.service.dto;

import com.smart.learning.config.Constants;
import com.smart.learning.domain.Authority;
import com.smart.learning.domain.User;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * A DTO representing a user, with his authorities.
 */
public class UserDTO {

    private boolean activated = false;

    private Set<String> authorities;

    private Instant createdAt;

    private String createdBy;

    @Email
    @Size(min = 5, max = 100)
    private String email;

    @Size(max = 50)
    private String firstName;

    private String id;

    @Size(max = 256)
    private String imageUrl;

    @Size(min = 2, max = 5)
    private String langKey;

    @Size(max = 50)
    private String lastName;

    private Instant modifiedAt;

    private String modifiedBy;

    @NotBlank
    @Pattern(regexp = Constants.USERNAME_PATTERN)
    @Size(min = 1, max = 50)
    private String username;

    public UserDTO() {
        // Empty constructor needed for Jackson.
    }

    public UserDTO(User user) {
        this(
            user.getId(),
            user.getUsername(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.isActivated(),
            user.getImageUrl(),
            user.getLangKey(),
            user.getCreatedBy(),
            user.getCreatedAt(),
            user.getModifiedBy(),
            user.getModifiedAt(),
            user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet())
        );
    }

    public UserDTO(String id, String username, String firstName, String lastName,
                   String email, boolean activated, String imageUrl, String langKey,
                   String createdBy, Instant createdAt, String modifiedBy, Instant modifiedAt,
                   Set<String> authorities) {

        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.activated = activated;
        this.imageUrl = imageUrl;
        this.langKey = langKey;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.modifiedBy = modifiedBy;
        this.modifiedAt = modifiedAt;
        this.authorities = authorities;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("activated", activated)
            .append("authorities", authorities)
            .append("createdBy", createdBy)
            .append("createdAt", createdAt)
            .append("email", email)
            .append("firstName", firstName)
            .append("id", id)
            .append("imageUrl", imageUrl)
            .append("langKey", langKey)
            .append("modifiedBy", modifiedBy)
            .append("modifiedAt", modifiedAt)
            .append("lastName", lastName)
            .append("username", username)
            .toString();
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getLangKey() {
        return langKey;
    }

    public String getLastName() {
        return lastName;
    }

    public Instant getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isActivated() {
        return activated;
    }
}
