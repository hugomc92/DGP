package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a Content Information
 *
 * @author Miguel Ángel Torres López
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

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getBlindDescription() {
        return blindDescription;
    }

    public Language getLanguage() {
        return language;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setBlindDescription(String blindDescription) {
        this.blindDescription = blindDescription;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }
}

