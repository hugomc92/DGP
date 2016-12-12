package es.ugr.redforest.museumsforeveryone.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Date;

/**
 * Class containing all data from a Content
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class Content {
    private int id;
    private Date creation_date;
    private Date dateIn;
    private Date dateOut;

    private ArrayList<Multimedia> multimedia;
    private ContentInformation contentInformation;
    private ContentType contentType;


    public Content(int id, Date creation_date, Date dateIn, Date dateOut) {
        this.id = id;
        this.creation_date = creation_date;
        this.dateIn = dateIn;
        this.dateOut = dateOut;
        this.multimedia = new ArrayList<>();
    }
    public Content()
    {this.multimedia = new ArrayList<>();}
    public void addMultimedia(Multimedia m){
        multimedia.add(m);
    }
    public ArrayList<Multimedia> getMultimediaByType(String type){
        ArrayList<Multimedia> multimediaByType = new ArrayList<>();
        for(int i=0;i<multimedia.size();++i){
            if(multimedia.get(i).getType().compareTo(type)==0){
                multimediaByType.add(multimedia.get(i));
            }
        }
        return multimediaByType;
    }

    public ContentInformation getContentInformation() {
        return contentInformation;
    }

    public void setContentInformation(ContentInformation contentInformation) {
        this.contentInformation = contentInformation;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }
    @JsonProperty("ID")
    public int getId() {
        return id;
    }
    @JsonProperty("CREATION_DATE")
    public Date getCreation_date() {
        return creation_date;
    }
    @JsonProperty("DATE_IN")
    public Date getDateIn() {
        return dateIn;
    }
    @JsonProperty("DATE_OUT")
    public Date getDateOut() {
        return dateOut;
    }
    @JsonProperty("ID")
    public void setId(int id) {
        this.id = id;
    }
    @JsonProperty("CREATION_DATE")
    public void setCreation_date(Date creation_date) {
        this.creation_date = creation_date;
    }
    @JsonProperty("DATE_IN")
    public void setDateIn(Date dateIn) {
        this.dateIn = dateIn;
    }
    @JsonProperty("DATE_OUT")
    public void setDateOut(Date dateOut) {
        this.dateOut = dateOut;
    }
}
