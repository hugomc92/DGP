package es.ugr.redforest.museumsforeveryone.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String id_lang;

    public Multimedia(int id, String url, String type,String alternativeText) {
        this.id = id;
        this.url = url;
        this.type = type;
        this.alternativeText = alternativeText;
    }
    public Multimedia(){

    }
    @JsonProperty("SUBTITLE")
    public String getSubtitle() {
        return subtitle;
    }
    @JsonProperty("SUBTITLE")
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }
    @JsonProperty("ALT_TEXT")
    public String getAlternativeText() {
        return alternativeText;
    }
    @JsonProperty("ALT_TEXT")
    public void setAlternativeText(String alternativeText) {
        this.alternativeText = alternativeText;
    }
    @JsonProperty("LANG_ID")
    public String getId_lang() {
        return id_lang;
    }
    @JsonProperty("LANG_ID")
    public void setId_lang(String id_lang) {
        this.id_lang = id_lang;
    }
    @JsonProperty("ID")
    public int getId() {
        return id;
    }
    @JsonProperty("URL")
    public String getUrl() {
        return url;
    }
    @JsonIgnore
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
    @JsonIgnore
    public void setType(String type) {
        this.type = type;
    }
}
