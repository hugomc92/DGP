package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a language
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class ArtWork {

    private String artWork;    //String which will be shown in the UI

    /**
     * Empty constructor
     */
    public ArtWork() {

    }

    /**
     * initializer contrsuctor
     *
     * @param artWork String which will be shown in th UI
     */
    public ArtWork(String artWork) {
        this.artWork = artWork;
    }

    /**
     * Gets the String shown in the UI
     *
     * @return Returns a String
     */
    public String getArtWork() {

        return artWork;
    }

    /**
     * Sets the String shown in the UI
     *
     * @param artWork String to show
     */
    public void setArtWork(String artWork) {

        this.artWork = artWork;
    }
}
