package com.smart.learning.domain;

import com.smart.learning.domain.util.StringBaseDateModel;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Persist AuditEvent managed by the Spring Boot actuator
 *
 * @see org.springframework.boot.actuate.audit.AuditEvent
 */

//I think using underscore has more advantages than using camel case
// one of them is avoiding case sensitivity and it is more readable
@Document(collection = "persistent_audit_event")
public class PersistentAuditEvent extends StringBaseDateModel {

    private static final long serialVersionUID = 1854067001670369723L;

    private transient Instant auditEventDate;

    private String auditEventType;

    private Map<String, String> data = new HashMap<>();

    @NotNull
    private String principal;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PersistentAuditEvent that = (PersistentAuditEvent) o;

        return new EqualsBuilder()
            .append(auditEventDate, that.auditEventDate)
            .append(auditEventType, that.auditEventType)
            .append(data, that.data)
            .append(principal, that.principal)
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(auditEventDate)
            .append(auditEventType)
            .append(data)
            .append(principal)
            .toHashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("auditEventDate", auditEventDate)
            .append("auditEventType", auditEventType)
            .append("data", data)
            .append("principal", principal)
            .toString();
    }

    public Instant getAuditEventDate() {
        return auditEventDate;
    }

    public PersistentAuditEvent setAuditEventDate(Instant auditEventDate) {
        this.auditEventDate = auditEventDate;
        return this;
    }

    public String getAuditEventType() {
        return auditEventType;
    }

    public PersistentAuditEvent setAuditEventType(String auditEventType) {
        this.auditEventType = auditEventType;
        return this;
    }

    public Map<String, String> getData() {
        return data;
    }

    public PersistentAuditEvent setData(Map<String, String> data) {
        this.data = data;
        return this;
    }

    public String getPrincipal() {
        return principal;
    }

    public PersistentAuditEvent setPrincipal(String principal) {
        this.principal = principal;
        return this;
    }
}
