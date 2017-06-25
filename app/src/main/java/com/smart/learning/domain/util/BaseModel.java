package com.smart.learning.domain.util;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.data.annotation.Id;

import java.io.Serializable;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */
public abstract class BaseModel<T extends Serializable> extends BaseDateModel {

    @Id
    private T id;

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("id", id)
            .append("parent", super.toString())
            .toString();
    }

    public T getId() {
        return id;
    }

    public BaseModel setId(T id) {
        this.id = id;
        return this;
    }
}
