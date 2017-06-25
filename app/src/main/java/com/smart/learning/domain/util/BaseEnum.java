package com.smart.learning.domain.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.io.Serializable;

/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */
public interface BaseEnum<T extends Serializable> {

    static <E extends BaseEnum, T extends Serializable> E find(Class<E> enumType, T key) {
        E[] objects = enumType.getEnumConstants();
        for (E item : objects) {
            if (key.equals(item.name())) {
                return item;
            }
        }
        return null;
    }

    T name();

    String getText();

    class Deserializer extends StdDeserializer<BaseEnum> {

        private transient BaseEnum[] all;

        public Deserializer(Class<?> clazz, BaseEnum[] all) {
            super(clazz);
            this.all = all;
        }

        @Override
        public BaseEnum deserialize(JsonParser jp, DeserializationContext dc) throws IOException {
            final JsonNode jsonNode = jp.readValueAsTree();
            if (jsonNode == null || jsonNode.isNull()) {
                return null;
            }
            Serializable key = jsonNode.isObject() ? getKey(jsonNode.get("name")) : getKey(jsonNode);

            if (key == null) {
                return null;
            }

            for (BaseEnum me : all) {
                if (me.name().equals(key)) {
                    return me;
                }
            }
            throw dc.mappingException("Cannot deserialize " + handledType().getSimpleName() + " from key " + key);
        }

        private Serializable getKey(JsonNode jsonNode) {
            if (jsonNode.isNull()) {
                return null;
            } else if (jsonNode.isTextual()) {
                return jsonNode.asText();
            } else if (jsonNode.isInt()) {
                return jsonNode.asInt();
            } else if (jsonNode.isFloat() || jsonNode.isDouble()) {
                return jsonNode.asDouble();
            } else if (jsonNode.isLong()) {
                return jsonNode.asLong();
            }

            return jsonNode.asBoolean();
        }
    }
}
