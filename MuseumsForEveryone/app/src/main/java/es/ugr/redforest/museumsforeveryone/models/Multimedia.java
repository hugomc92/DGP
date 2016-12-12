package es.ugr.redforest.museumsforeveryone.models;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all data from a Multimedia
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class Multimedia {
    private int id;
    private String url;
    private String type;
    private String alternativeText;
    private String subtitle;

    public Multimedia(int id, String url, String type,String alternativeText) {
        this.id = id;
        this.url = url;
        this.type = type;
        this.alternativeText = alternativeText;
    }

    public String getSubtitle() {
        return subtitle;
    }
    public Multimedia(){

    }
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getAlternativeText() {
        return alternativeText;
    }

    public void setAlternativeText(String alternativeText) {
        this.alternativeText = alternativeText;
    }
    @JsonProperty("ID")
    public int getId() {
        return id;
    }
    @JsonProperty("URL")
    public String getUrl() {
        return url;
    }
    @JsonProperty("TYPE")
    public String getType() {
        return type;
    }
    @JsonProperty("ID")
    public void setId(int id) {
        this.id = id;
    }
    @JsonProperty("URL")
    public void setUrl(String url) {
        this.url = url;
    }
    @JsonProperty("TYPE")
    public void setType(String type) {
        this.type = type;
    }
}
