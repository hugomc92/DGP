package es.ugr.redforest.museumsforeveryone.models;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

/**
 * Class containing all data from a guided visit
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class GuidedVisit {

    private int id;
    private String name;
    private String description;
    private String blindDescription;
    private String photo_alt_text;
    private String photo;

    public GuidedVisit(int id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    public GuidedVisit()
    {}
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
    @JsonProperty("BLIN_DESCRIPTION")
    public String getBlindDescription() {
        return blindDescription;
    }
    @JsonProperty("BLIN_DESCRIPTION")
    public void setBlindDescription(String blindDescription) {
        this.blindDescription = blindDescription;
    }
    @JsonProperty("PHOTO_ALT_TEXT")
    public String getPhoto_alt_text() {
        return photo_alt_text;
    }
    @JsonProperty("PHOTO_ALT_TEXT")
    public void setPhoto_alt_text(String photo_alt_text) {
        this.photo_alt_text = photo_alt_text;
    }
    @JsonProperty("PHOTO")
    public String getPhoto() {
        return photo;
    }
    @JsonProperty("PHOTO")
    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
