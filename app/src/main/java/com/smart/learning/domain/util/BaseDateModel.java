package com.smart.learning.domain.util;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serializable;
import java.time.Instant;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */
@JsonIgnoreProperties(value = {"createdAt", "modifiedAt", "createdBy", "modifiedBy"}, allowGetters = true)
public abstract class BaseDateModel implements Serializable {

    @CreatedDate
    private transient Instant createdAt = Instant.now();

    @CreatedBy
    private String createdBy;

    @LastModifiedDate
    private transient Instant modifiedAt = Instant.now();

    @LastModifiedBy
    private String modifiedBy;

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("createdAt", createdAt)
            .append("createdBy", createdBy)
            .append("modifiedAt", modifiedAt)
            .append("modifiedBy", modifiedBy)
            .toString();
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public BaseDateModel setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public BaseDateModel setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public Instant getModifiedAt() {
        return modifiedAt;
    }

    public BaseDateModel setModifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
        return this;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public BaseDateModel setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
        return this;
    }
}
