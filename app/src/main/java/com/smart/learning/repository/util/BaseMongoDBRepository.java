package com.smart.learning.repository.util;

import com.smart.learning.domain.util.BaseModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */
@NoRepositoryBean
public interface BaseMongoDBRepository<E extends BaseModel<T>, T extends Serializable> extends MongoRepository<E, T>, BaseRepository<E, T> {

}
