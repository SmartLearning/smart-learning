package com.smart.learning.web.rest.vm;

import com.smart.learning.service.dto.UserDTO;
import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.validation.constraints.Size;

/**
 * View Model extending the UserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserVM extends UserDTO {

    public static final int PASSWORD_MAX_LENGTH = 100;

    public static final int PASSWORD_MIN_LENGTH = 4;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    public ManagedUserVM() {
        // Empty constructor needed for Jackson.
    }

    public ManagedUserVM(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("super", super.toString())
            .toString();
    }

    public String getPassword() {
        return password;
    }
}
