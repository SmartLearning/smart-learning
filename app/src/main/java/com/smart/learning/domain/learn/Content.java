package com.smart.learning.domain.learn;

import com.smart.learning.domain.util.StringBaseDateModel;
import org.springframework.data.mongodb.core.mapping.Document;

import java.net.URI;
import java.util.Set;

/**
 * A smallest unit of learning in the system. For instance, a content about
 * an English word that student should learn as part of choosen interest.
 * The content could be a video presenting a particular subject such as
 * a html text, file, image, etc. Each content has
 * a unique resource identifier that points to the content location and
 * a type that tells the system how the content should be rendered
 * on the screen based on type of resource
 * it points to.
 */
@Document(collection = "contents")
public class Content extends StringBaseDateModel {
    /**
     * type of the resource: video, Google doc, pdf, image, etc.
     */
    private String type;
    /**
     * points to where the content is available
     */
    private URI resource;
    /**
     * assigned tags by system or teachers
     */
    private Set<Tag> tags;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public URI getResource() {
        return resource;
    }

    public void setResource(URI resource) {
        this.resource = resource;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
