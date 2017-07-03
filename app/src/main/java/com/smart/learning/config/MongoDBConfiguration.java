package com.smart.learning.config;

import com.github.mongobee.Mongobee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.CustomConversions;
import org.springframework.data.mongodb.core.mapping.event.ValidatingMongoEventListener;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.ArrayList;
import java.util.List;

import static com.smart.learning.domain.util.JSR310DateConverters.*;

@Configuration
@Import(value = MongoAutoConfiguration.class)
@EnableMongoRepositories("com.smart.learning.repository.mongo")
@EnableMongoAuditing(auditorAwareRef = "springSecurityAuditorAware")
public class MongoDBConfiguration {

    private final Logger logger = LoggerFactory.getLogger(MongoDBConfiguration.class);

    @Bean
    public CustomConversions customConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(DateToZonedDateTimeConverter.INSTANCE);
        converters.add(ZonedDateTimeToDateConverter.INSTANCE);
        converters.add(DateToLocalDateConverter.INSTANCE);
        converters.add(LocalDateToDateConverter.INSTANCE);
        converters.add(DateToLocalDateTimeConverter.INSTANCE);
        converters.add(LocalDateTimeToDateConverter.INSTANCE);
        converters.add(YearMonthToDateConverter.INSTANCE);
        converters.add(DateToYearMonthConverter.INSTANCE);
        converters.add(StringToZonedDateTimeConverter.INSTANCE);
        return new CustomConversions(converters);
    }

    @Bean
    public Mongobee mongobee(MongoTemplate mongoTemplate, MongoProperties mongoProperties) {
        logger.debug("Configuring Mongobee");
        Mongobee mongobee = new Mongobee(mongoProperties.getUri());
        mongobee.setDbName(mongoProperties.getDatabase());
        mongobee.setMongoTemplate(mongoTemplate);
        // package to scan for migrations
        mongobee.setChangeLogsScanPackage("com.smart.learning.repository.migrations");
        mongobee.setEnabled(true);
        return mongobee;
    }

    @Bean
    public ValidatingMongoEventListener validatingMongoEventListener() {
        return new ValidatingMongoEventListener(validator());
    }

    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }
}
