package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a Content Type
 *
 * @author Miguel Ángel Torres López
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

    public String getName() {
        return name;
    }

    public String getIcon() {
        return icon;
    }

    public String getDescription() {
        return description;
    }

    public int getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(int id) {
        this.id = id;
    }
}
