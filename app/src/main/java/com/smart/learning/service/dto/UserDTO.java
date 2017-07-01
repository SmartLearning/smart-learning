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
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.activated = user.isActivated();
        this.imageUrl = user.getImageUrl();
        this.langKey = user.getLangKey();
        this.createdBy = user.getCreatedBy();
        this.createdAt = user.getCreatedAt();
        this.modifiedBy = user.getModifiedBy();
        this.modifiedAt = user.getModifiedAt();
        this.authorities = user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet());
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

    public UserDTO setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
        return this;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public UserDTO setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public UserDTO setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public UserDTO setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getFirstName() {
        return firstName;
    }

    public UserDTO setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getId() {
        return id;
    }

    public UserDTO setId(String id) {
        this.id = id;
        return this;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public UserDTO setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    public String getLangKey() {
        return langKey;
    }

    public UserDTO setLangKey(String langKey) {
        this.langKey = langKey;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public UserDTO setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public Instant getModifiedAt() {
        return modifiedAt;
    }

    public UserDTO setModifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
        return this;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public UserDTO setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
        return this;
    }

    public String getUsername() {
        return username;
    }

    public UserDTO setUsername(String username) {
        this.username = username;
        return this;
    }

    public boolean isActivated() {
        return activated;
    }

    public UserDTO setActivated(boolean activated) {
        this.activated = activated;
        return this;
    }
}
