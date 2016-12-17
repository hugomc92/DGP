package es.ugr.redforest.museumsforeveryone.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

/**
 * Class containing all data from a Location
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class Location {
    private int id;
    private String description;
    private String nfc;
    private String qr;
    private String coordinates;
    private int order;
    @JsonIgnoreProperties
    private ArrayList<Content> contents;

    public Location(int id, String description, String nfc, String qr, String coordinates) {
        this.id = id;
        this.description = description;
        this.nfc = nfc;
        this.qr = qr;
        this.coordinates = coordinates;
        this.contents = new ArrayList<>();
    }
    public Location(){
        this.contents = new ArrayList<>();
    }

    public ArrayList<Content> getContents() {
        return contents;
    }
    public void addContent(Content c){
        contents.add(c);
    }
    @JsonProperty("ID")
    public int getId() {
        return id;
    }
    @JsonProperty("DESCRIPTION")
    public String getDescription() {
        return description;
    }
    @JsonProperty("NFC")
    public String getNfc() {
        return nfc;
    }
    @JsonProperty("QR")
    public String getQr() {
        return qr;
    }
    @JsonProperty("COORDINATES")
    public String getCoordinates() {
        return coordinates;
    }
    @JsonProperty("ID")
    public void setId(int id) {
        this.id = id;
    }
    @JsonProperty("DESCRIPTION")
    public void setDescription(String description) {
        this.description = description;
    }
    @JsonProperty("NFC")
    public void setNfc(String nfc) {
        this.nfc = nfc;
    }
    @JsonProperty("QR")
    public void setQr(String qr) {
        this.qr = qr;
    }
    @JsonProperty("COORDINATES")
    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }
    @JsonProperty("ORDER")
    public int getOrder() {
        return order;
    }
    @JsonProperty("ORDER")
    public void setOrder(int order) {
        this.order = order;
    }
}
