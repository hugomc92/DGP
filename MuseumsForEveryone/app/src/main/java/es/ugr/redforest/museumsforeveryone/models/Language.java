package es.ugr.redforest.museumsforeveryone.models;

/**
 * Class containing all data from a language
 *
 * @author Gregorio Carvajal Exposito
 * @version 1.0.0
 */

public class Language {

	private String lang;    //String which will be shown in the UI
	private int image;      //Reference to the resource of the flag image for the language

	/**
	 * Empty constructor
	 */
	public Language() {

	}

	/**
	 * initializer contrsuctor
	 *
	 * @param lang String which will be shown in th UI
	 * @param image Reference to the resource of the flag image for the language
	 */
	public Language(String lang, int image) {
		this.lang = lang;
		this.image = image;
	}

	/**
	 * Gets the String shown in the UI
	 *
	 * @return Returns a String
	 */
	public String getLang() {

		return lang;
	}

	/**
	 * Sets the String shown in the UI
	 *
	 * @param lang String to show
	 */
	public void setLang(String lang) {

		this.lang = lang;
	}

	/**
	 * Gets the reference to the image
	 *
	 * @return Integer ID of the image resource
	 */
	public int getImage() {

		return image;
	}

	/**
	 * Sets the reference to the image
	 *
	 * @param image Integer ID of the image resource
	 */
	public void setImage(int image) {

		this.image = image;
	}
}
