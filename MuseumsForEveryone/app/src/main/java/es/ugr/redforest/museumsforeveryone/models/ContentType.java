package es.ugr.redforest.museumsforeveryone.models;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all data from a Content Type
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class ContentType {

    private int id;
    private String name;
    private String description;
    private String icon;

    public ContentType(int id, String name, String description, String icon) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
    }
    public ContentType(){

    }
    @JsonProperty("NAME")
    public String getName() {
        return name;
    }
    @JsonProperty("ICON")
    public String getIcon() {
        return icon;
    }
    @JsonProperty("DESCRIPTION")
    public String getDescription() {
        return description;
    }
    @JsonProperty("ID")
    public int getId() {
        return id;
    }
    @JsonProperty("NAME")
    public void setName(String name) {
        this.name = name;
    }
    @JsonProperty("ICON")
    public void setIcon(String icon) {
        this.icon = icon;
    }
    @JsonProperty("DESCRIPTION")
    public void setDescription(String description) {
        this.description = description;
    }
    @JsonProperty("ID")
    public void setId(int id) {
        this.id = id;
    }
}
