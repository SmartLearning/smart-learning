package com.smart.learning.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smart.learning.config.Constants;
import com.smart.learning.domain.util.StringBaseDateModel;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.validator.constraints.Email;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A user.
 */
@Document(collection = "users")
public class User extends StringBaseDateModel {

    public static final int USERNAME_MAX_LENGTH = 50;

    public static final int USERNAME_MIN_LENGTH = 1;

    private static final long serialVersionUID = -1255139083327349445L;

    private boolean activated = false;

    @JsonIgnore
    @Size(max = 20)
    private String activationKey;

    @JsonIgnore
    private Set<Authority> authorities = new HashSet<>();

    @Email
    @Indexed(unique = true)
    @Size(min = 5, max = 100)
    private String email;

    @Size(max = 50)
    private String firstName;

    @Size(max = 256)
    private String imageUrl;

    @Size(min = 2, max = 5)
    private String langKey;

    @Size(max = 50)
    private String lastName;

    @NotNull
    @JsonIgnore
    @Size(min = 60, max = 60)
    private String password;

    private transient Instant resetDate = null;

    @JsonIgnore
    @Size(max = 20)
    private String resetKey;

    @NotNull
    @Indexed
    @Pattern(regexp = Constants.USERNAME_PATTERN)
    @Size(min = USERNAME_MIN_LENGTH, max = USERNAME_MAX_LENGTH)
    private String username;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        User user = (User) o;

        return new EqualsBuilder()
            .append(activated, user.activated)
            .append(authorities, user.authorities)
            .append(email, user.email)
            .append(firstName, user.firstName)
            .append(imageUrl, user.imageUrl)
            .append(langKey, user.langKey)
            .append(lastName, user.lastName)
            .append(password, user.password)
            .append(username, user.username)
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(activated)
            .append(authorities)
            .append(email)
            .append(firstName)
            .append(imageUrl)
            .append(langKey)
            .append(lastName)
            .append(password)
            .append(username)
            .toHashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("firstName", firstName)
            .append("lastName", lastName)
            .append("email", email)
            .append("activated", activated)
            .append("langKey", langKey)
            .append("imageUrl", imageUrl)
            .append("activationKey", activationKey)
            .append("resetKey", resetKey)
            .append("resetDate", resetDate)
            .append("authorities", authorities)
            .append("username", username)
            .toString();
    }

    public String getActivationKey() {
        return activationKey;
    }

    public User setActivationKey(String activationKey) {
        this.activationKey = activationKey;
        return this;
    }

    public Set<Authority> getAuthorities() {
        return authorities;
    }

    public User setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public User setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getFirstName() {
        return firstName;
    }

    public User setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public User setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    public String getLangKey() {
        return langKey;
    }

    public User setLangKey(String langKey) {
        this.langKey = langKey;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public User setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public User setPassword(String password) {
        this.password = password;
        return this;
    }

    public Instant getResetDate() {
        return resetDate;
    }

    public User setResetDate(Instant resetDate) {
        this.resetDate = resetDate;
        return this;
    }

    public String getResetKey() {
        return resetKey;
    }

    public User setResetKey(String resetKey) {
        this.resetKey = resetKey;
        return this;
    }

    public String getUsername() {
        return username;
    }

    public User setUsername(String username) {
        this.username = username;
        return this;
    }

    public boolean isActivated() {
        return activated;
    }

    public User setActivated(boolean activated) {
        this.activated = activated;
        return this;
    }

}

