package com.smart.learning.service.util;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import com.mongodb.util.JSONParseException;
import com.smart.learning.repository.util.BaseRepository;
import com.smart.learning.service.errors.ClientSideException;
import com.smart.learning.web.rest.errors.ErrorConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.convert.MongoWriter;
import org.springframework.http.HttpStatus;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */
public abstract class BaseService<E, T extends Serializable, R extends BaseRepository<E, T>> {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    protected R repository;

    public BaseService(R rep) {
        repository = rep;
    }

    public long count() {
        return repository.count();
    }

    public boolean exists(T id) {
        return repository.exists(id);
    }

    public List<E> findAll() {
        return repository.findAll();
    }

    public Page<E> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<E> get(T id) {
        return Optional.ofNullable(repository.findOne(id));
    }

    public void remove(T entity) {
        repository.delete(entity);
    }

    public E save(E entity) {
        return repository.save(entity);
    }

    protected <O> DBObject toDbObject(O objectToSave, MongoWriter<O> writer) {
        if (!(objectToSave instanceof String)) {
            DBObject dbDoc = new BasicDBObject();
            writer.write(objectToSave, dbDoc);
            return dbDoc;
        } else {
            try {
                return (DBObject) JSON.parse((String) objectToSave);
            } catch (JSONParseException e) {
                logger.error("Could not parse given String to save into a JSON document!, exception: {}", e);
                throw new ClientSideException(ErrorConstants.ERR_INTERNAL_SERVER_ERROR, HttpStatus.BAD_REQUEST);
            }
        }
    }
}
