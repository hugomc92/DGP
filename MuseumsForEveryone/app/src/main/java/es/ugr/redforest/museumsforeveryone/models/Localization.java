package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a Localization
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class Localization {
    private int id;
    private String description;
    private String nfc;
    private String qr;
    private String coordinates;

    public Localization(int id, String description, String nfc, String qr, String coordinates) {
        this.id = id;
        this.description = description;
        this.nfc = nfc;
        this.qr = qr;
        this.coordinates = coordinates;
    }

    public int getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getNfc() {
        return nfc;
    }

    public String getQr() {
        return qr;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setNfc(String nfc) {
        this.nfc = nfc;
    }

    public void setQr(String qr) {
        this.qr = qr;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }
}
