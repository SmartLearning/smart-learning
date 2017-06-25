package com.smart.learning.repository.util;

import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.io.Serializable;
import java.util.List;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

@NoRepositoryBean
public interface BaseRepository<E, T extends Serializable> extends PagingAndSortingRepository<E, T> {

    List<E> findAll();
}
