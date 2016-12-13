package es.ugr.redforest.museumsforeveryone.models;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all data from a Content Information
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class ContentInformation {
    private int id;
    private String name;
    private String description;
    private String blindDescription;
    private Language language;

    public ContentInformation(int id, String name, String description, String blindDescription, Language language) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.blindDescription = blindDescription;
        this.language = language;
    }
    public ContentInformation(){

    }
    @JsonProperty("ID")
    public int getId() {
        return id;
    }
    @JsonProperty("NAME")
    public String getName() {
        return name;
    }
    @JsonProperty("DESCRIPTION")
    public String getDescription() {
        return description;
    }
    @JsonProperty("BLIND_DESCRIPTION")
    public String getBlindDescription() {
        return blindDescription;
    }

    public Language getLanguage() {
        return language;
    }
    @JsonProperty("ID")
    public void setId(int id) {
        this.id = id;
    }
    @JsonProperty("NAME")
    public void setName(String name) {
        this.name = name;
    }
    @JsonProperty("DESCRIPTION")
    public void setDescription(String description) {
        this.description = description;
    }
    @JsonProperty("BLIND_DESCRIPTION")
    public void setBlindDescription(String blindDescription) {
        this.blindDescription = blindDescription;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }
}

