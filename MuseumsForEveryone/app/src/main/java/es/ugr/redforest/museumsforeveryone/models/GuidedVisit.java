package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a guided visit
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class GuidedVisit {

    private String guidedVisit;    //String which will be shown in the UI

    /**
     * Empty constructor
     */
    public GuidedVisit() {

    }

    /**
     * initializer contrsuctor
     *
     * @param guidedVisit String which will be shown in th UI
     */
    public GuidedVisit(String guidedVisit) {
        this.guidedVisit = guidedVisit;
    }

    /**
     * Gets the String shown in the UI
     *
     * @return Returns a String
     */
    public String getGuidedVisit() {

        return guidedVisit;
    }

    /**
     * Sets the String shown in the UI
     *
     * @param guidedVisit String to show
     */
    public void setLang(String guidedVisit) {

        this.guidedVisit = guidedVisit;
    }

}
