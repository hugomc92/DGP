package es.ugr.redforest.museumsforeveryone.models;

import java.util.Date;

/**
 * Class containing all data from a Content
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class Content {
    private int id;
    private Date creation_date;
    private Date dateIn;
    private Date dateOut;

    public Content(int id, Date creation_date, Date dateIn, Date dateOut) {
        this.id = id;
        this.creation_date = creation_date;
        this.dateIn = dateIn;
        this.dateOut = dateOut;
    }

    public int getId() {
        return id;
    }

    public Date getCreation_date() {
        return creation_date;
    }

    public Date getDateIn() {
        return dateIn;
    }

    public Date getDateOut() {
        return dateOut;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setCreation_date(Date creation_date) {
        this.creation_date = creation_date;
    }

    public void setDateIn(Date dateIn) {
        this.dateIn = dateIn;
    }

    public void setDateOut(Date dateOut) {
        this.dateOut = dateOut;
    }
}
