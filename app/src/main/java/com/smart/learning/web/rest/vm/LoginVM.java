package com.smart.learning.web.rest.vm;

import com.smart.learning.config.Constants;
import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * View Model object for storing a user's credentials.
 */
public class LoginVM {

    @NotNull
    @Size(min = ManagedUserVM.PASSWORD_MIN_LENGTH, max = ManagedUserVM.PASSWORD_MAX_LENGTH)
    private String password;

    private Boolean rememberMe;

    @Pattern(regexp = Constants.USERNAME_PATTERN)
    @NotNull
    @Size(min = 1, max = 50)
    private String username;

    public Boolean isRememberMe() {
        return rememberMe;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("rememberMe", rememberMe)
            .append("username", username)
            .toString();
    }

    public void setRememberMe(Boolean rememberMe) {
        this.rememberMe = rememberMe;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
