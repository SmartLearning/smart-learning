package com.smart.learning.service.util;

import com.mongodb.DBObject;
import com.smart.learning.domain.util.BaseModel;
import com.smart.learning.repository.util.BaseMongoDBRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.mapping.context.MappingContext;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.MongoPersistentEntity;
import org.springframework.data.mongodb.core.mapping.MongoPersistentProperty;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.data.mongodb.core.mapping.event.MongoMappingEvent;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.io.Serializable;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 * <p>
 * This class helps to save exactly the information that is requested to change and does not effect on other fields
 */

public abstract class MongoPartialService<E extends BaseModel<T>, T extends Serializable, R extends BaseMongoDBRepository<E, T>> extends BaseService<E, T, R> {

    private ApplicationEventPublisher publisher;

    private MongoTemplate template;

    public MongoPartialService(R rep, MongoTemplate template, ApplicationEventPublisher publisher) {
        super(rep);
        this.template = template;
        this.publisher = publisher;
    }

    @Override
    public E save(E entity) {
        if (entity.getId() == null) {
            return repository.save(entity);
        } else {
            MappingContext<? extends MongoPersistentEntity<?>, MongoPersistentProperty> context = template.getConverter().getMappingContext();
            MongoPersistentEntity<?> persistentEntity = context.getPersistentEntity(entity.getClass());
            String collection = persistentEntity.getCollection();

            maybeEmitEvent(new BeforeConvertEvent<>(entity, collection));

            Query query = new Query(Criteria.where("_id").is(entity.getId()));
            DBObject object = toDbObject(entity, template.getConverter());
            Update update = new Update();
            for (String key : object.keySet()) {
                //We should ignore to set createdAt, createdBy and _id for editing because they should just set in creation time only
                if ("_id".equals(key) || "createdAt".equals(key) || "createdBy".equals(key)) {
                    continue;
                }
                update.set(key, object.get(key));
            }

            maybeEmitEvent(new BeforeSaveEvent<>(entity, object, collection));

            template.updateFirst(query, update, entity.getClass(), collection);

            maybeEmitEvent(new AfterSaveEvent<>(entity, object, collection));

            return entity;
        }
    }

    protected <T> void maybeEmitEvent(MongoMappingEvent<T> event) {
        if (null != publisher) {
            publisher.publishEvent(event);
        }
    }
}
