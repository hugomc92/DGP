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
    private Date dateOut;

    public GuidedVisit(int id, String name, String description, Date dateOut) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.dateOut = dateOut;
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
    @JsonProperty("DATE_OUT")
    public Date getDateOut() {
        return dateOut;
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
    @JsonProperty("DATE_OUT")
    public void setDateOut(Date dateOut) {
        this.dateOut = dateOut;
    }
}
