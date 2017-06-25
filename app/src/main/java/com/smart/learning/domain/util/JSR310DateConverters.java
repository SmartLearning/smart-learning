package com.smart.learning.domain.util;

import org.springframework.core.convert.converter.Converter;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public final class JSR310DateConverters {

    private JSR310DateConverters() {
    }

    public enum DateToLocalDateConverter implements Converter<Date, LocalDate> {
        INSTANCE;

        @Override
        public LocalDate convert(Date source) {
            return source == null ? null : ZonedDateTime.ofInstant(source.toInstant(), ZoneId.systemDefault())
                .toLocalDate();
        }
    }

    public enum DateToLocalDateTimeConverter implements Converter<Date, LocalDateTime> {
        INSTANCE;

        @Override
        public LocalDateTime convert(Date source) {
            return source == null ? null : LocalDateTime.ofInstant(source.toInstant(), ZoneId.systemDefault());
        }
    }

    public enum DateToYearMonthConverter implements Converter<Date, YearMonth> {
        INSTANCE;

        @Override
        public YearMonth convert(Date source) {
            return source == null ? null : YearMonth.from(source.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        }
    }

    public enum DateToZonedDateTimeConverter implements Converter<Date, ZonedDateTime> {
        INSTANCE;

        @Override
        public ZonedDateTime convert(Date source) {
            return source == null ? null : ZonedDateTime.ofInstant(source.toInstant(), ZoneId.systemDefault());
        }
    }

    public enum LocalDateTimeToDateConverter implements Converter<LocalDateTime, Date> {
        INSTANCE;

        @Override
        public Date convert(LocalDateTime source) {
            return source == null ? null : Date.from(source.atZone(ZoneId.systemDefault()).toInstant());
        }
    }

    public enum LocalDateToDateConverter implements Converter<LocalDate, Date> {
        INSTANCE;

        @Override
        public Date convert(LocalDate source) {
            return source == null ? null : Date.from(source.atStartOfDay(ZoneId.systemDefault()).toInstant());
        }
    }

    public enum StringToZonedDateTimeConverter implements Converter<String, ZonedDateTime> {
        INSTANCE;

        @Override
        public ZonedDateTime convert(String source) {
            return source == null ? null : ZonedDateTime.parse(source, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        }
    }

    public enum YearMonthToDateConverter implements Converter<YearMonth, Date> {
        INSTANCE;

        @Override
        public Date convert(YearMonth source) {
            return source == null ? null : Date.from(source.atEndOfMonth().atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant());
        }
    }

    public enum ZonedDateTimeToDateConverter implements Converter<ZonedDateTime, Date> {
        INSTANCE;

        @Override
        public Date convert(ZonedDateTime source) {
            return source == null ? null : Date.from(source.toInstant());
        }
    }
}
