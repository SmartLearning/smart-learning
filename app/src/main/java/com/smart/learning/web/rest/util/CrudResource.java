package com.smart.learning.web.rest.util;

import com.codahale.metrics.annotation.Timed;
import com.smart.learning.domain.util.BaseModel;
import com.smart.learning.repository.util.BaseRepository;
import com.smart.learning.service.util.BaseService;
import com.smart.learning.web.rest.errors.ErrorConstants;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

public abstract class CrudResource<
    E extends BaseModel,
    T extends Serializable,
    R extends BaseRepository<E, T>,
    S extends BaseService<E, T, R>
    > {

    public static final String DELIMITER = "/";

    public static final String GLOBAL_NAME = "global";

    protected S service;

    /**
     * POST  /{entityName} -> Create a new entity.
     */
    @Timed
    @PostMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<E> createEntity(@Valid @RequestBody E entity) throws URISyntaxException {
        getLogger().debug("REST request to save {} : {}", getEntityName(), entity);
        if (entity.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ErrorConstants.ERR_NOT_FOUND)).body(null);
        }
        E result = service.save(entity);
        return ResponseEntity.created(new URI(getBaseUrl() + DELIMITER + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(GLOBAL_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * DELETE  /{entityName}/:id -> delete the "id" entity.
     */
    @Timed
    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<Void> delete(@Valid @PathVariable T id) {
        getLogger().debug("REST request to delete {} : {}", getEntityName(), id);
        service.remove(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(GLOBAL_NAME, id.toString())).build();
    }

    /**
     * GET  /{entityName}/:id -> get the "id" entity.
     */
    @Timed
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<E> get(@Valid @PathVariable T id) {
        getLogger().debug("REST request to get {} : {}", getEntityName(), id);
        Optional<E> result = service.get(id);

        return result.map(response -> new ResponseEntity<>(response, HttpStatus.OK))
            .orElse(new ResponseEntity<>(null, HeaderUtil.createFailureAlert(ErrorConstants.ERR_NOT_FOUND), HttpStatus.NOT_FOUND));
    }

    /**
     * GET  / -> get all the entities.
     */
    @Timed
    @GetMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<List<E>> getAllEntities(Pageable pageable) throws URISyntaxException {
        getLogger().debug("REST request to get a page of " + getEntityName());
        return convertPage(service.findAll(pageable));
    }

    /**
     * PUT  /{entityName} -> Updates an existing entity.
     */
    @Timed
    @PutMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<E> updateEntity(@Valid @RequestBody E entity) throws URISyntaxException {
        getLogger().debug("REST request to update {} : {}", getEntityName(), entity);
        if (entity.getId() == null) {
            return createEntity(entity);
        }
        E result = service.save(entity);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(GLOBAL_NAME, entity.getId().toString()))
            .body(result);
    }

    protected ResponseEntity<List<E>> convertPage(Page<E> page) {
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, getBaseUrl());
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @Inject
    public void setService(S service) {
        this.service = service;
    }

    protected abstract String getBaseUrl();

    protected abstract String getEntityName();

    @NotNull
    protected abstract Logger getLogger();

}
