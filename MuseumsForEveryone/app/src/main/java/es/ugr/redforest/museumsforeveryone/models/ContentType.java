package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a Content Type
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class ContentType {

    private int id;
    private String contentName;
    private String description;
    private int icon;

    public ContentType(int id, String contentName, String description, int icon) {
        this.id = id;
        this.contentName = contentName;
        this.description = description;
        this.icon = icon;
    }

    public String getContentName() {
        return contentName;
    }

    public int getIcon() {
        return icon;
    }

    public String getDescription() {
        return description;
    }

    public int getId() {
        return id;
    }

    public void setContentName(String contentName) {
        this.contentName = contentName;
    }

    public void setIcon(int icon) {
        this.icon = icon;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(int id) {
        this.id = id;
    }
}
