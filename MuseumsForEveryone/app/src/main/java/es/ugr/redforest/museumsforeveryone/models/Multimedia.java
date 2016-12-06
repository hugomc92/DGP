package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a Multimedia
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class Multimedia {
    private int id;
    private String url;
    private String type;
    private String alternativeText;

    public Multimedia(int id, String url, String type,String alternativeText) {
        this.id = id;
        this.url = url;
        this.type = type;
        this.alternativeText = alternativeText;
    }

    public String getAlternativeText() {
        return alternativeText;
    }

    public void setAlternativeText(String alternativeText) {
        this.alternativeText = alternativeText;
    }
    public int getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public String getType() {
        return type;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setType(String type) {
        this.type = type;
    }
}
