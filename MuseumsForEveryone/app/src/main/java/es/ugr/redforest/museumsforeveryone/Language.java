package es.ugr.redforest.museumsforeveryone;

/**
 * Created by UserMan on 22/10/2016.
 */

public class Language {

	private String lang;
	private int image;

	public Language() {

	}

	public Language(String lang, int image) {
		this.lang = lang;
		this.image = image;
	}

	public String getLang() {

		return lang;
	}

	public void setLang(String lang) {

		this.lang = lang;
	}

	public int getImage() {

		return image;
	}

	public void setImage(int image) {

		this.image = image;
	}
}
