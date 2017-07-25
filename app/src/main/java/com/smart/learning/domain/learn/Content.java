package com.smart.learning.domain.learn;

import com.smart.learning.domain.util.StringBaseDateModel;
import com.smart.learning.domain.util.Tag;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.net.URI;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

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

    private static final long serialVersionUID = -7744852279957052291L;
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
    private List<Tag> tags = new LinkedList<>();

    @DBRef
    private List<Question> questions = new LinkedList<>();

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

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

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public boolean hasTag(String tag){
        return tags.stream().anyMatch(t->t.getName().equals(tag));
    }
    public Optional<String> findTagValue(String tag) {
        return tags.stream().filter(t -> tag.equals(t.getName())).findFirst().map(Tag::getValue);
    }
}
