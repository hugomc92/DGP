package es.ugr.redforest.museumsforeveryone.models;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all data from a language
 *
 * @author Gregorio Carvajal Exposito
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class Language {

	private String lang;    //String which will be shown in the UI
	private int image;      //Reference to the resource of the flag image for the language
	private String code;	//String with language's code


	/**
	 * Empty constructor
	 */
	public Language() {

	}

	/**
	 * initializer constructor
	 *
	 * @param lang String which will be shown in th UI
	 * @param image Reference to the resource of the flag image for the language
	 * @param code String with language's code
	 */
	public Language(String lang, int image,String code) {
		this.lang = lang;
		this.image = image;
		this.code = code;
	}

	/**
	 * Gets the String shown in the UI
	 *
	 * @return Returns a String
	 */
	@JsonProperty("LANGUAGE")
	public String getLang() {

		return lang;
	}

	/**
	 * Sets the String shown in the UI
	 *
	 * @param lang String to show
	 */
	@JsonProperty("LANGUAGE")
	public void setLang(String lang) {

		this.lang = lang;
	}

	/**
	 * Gets the reference to the image
	 *
	 * @return Integer ID of the image resource
	 */
	@JsonProperty("ICON")
	public int getImage() {

		return image;
	}

	/**
	 * Sets the reference to the image
	 *
	 * @param image Integer ID of the image resource
	 */
	@JsonProperty("ICON")
	public void setImage(int image) {

		this.image = image;
	}
	/**
	 * Gets language's code
	 *
	 * @return String with language's code
	 */
	@JsonProperty("CODE")
	public String getCode() {
		return code;
	}
	/**
	 * Gets language's code
	 *
	 *  @param code String with with language's code
	 */
	@JsonProperty("CODE")
	public void setCode(String code) {
		this.code = code;
	}
}
