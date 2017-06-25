package com.smart.learning.service;

import com.smart.learning.config.AuditEventConverter;
import com.smart.learning.repository.mongo.PersistenceAuditEventRepository;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

/**
 * Service for managing audit events.
 * <p>
 * This is the default implementation to support SpringBoot Actuator AuditEventRepository
 * </p>
 */
@Service
public class AuditEventService {

    private final AuditEventConverter auditEventConverter;

    private final PersistenceAuditEventRepository persistenceAuditEventRepository;

    public AuditEventService(PersistenceAuditEventRepository repository, AuditEventConverter converter) {
        this.persistenceAuditEventRepository = repository;
        this.auditEventConverter = converter;
    }

    public Optional<AuditEvent> find(String id) {
        return Optional.ofNullable(persistenceAuditEventRepository.findOne(id))
            .map(auditEventConverter::convertToAuditEvent);
    }

    public Page<AuditEvent> findAll(Pageable pageable) {
        return persistenceAuditEventRepository.findAll(pageable)
            .map(auditEventConverter::convertToAuditEvent);
    }

    public Page<AuditEvent> findByDates(Instant fromDate, Instant toDate, Pageable pageable) {
        return persistenceAuditEventRepository.findAllByAuditEventDateBetween(fromDate, toDate, pageable)
            .map(auditEventConverter::convertToAuditEvent);
    }
}
