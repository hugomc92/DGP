package es.ugr.redforest.museumsforeveryone;

import android.graphics.drawable.Drawable;

/**
 * Created by UserMan on 22/10/2016.
 */

public class Language {

	private String lang;
	private Drawable image;

	public Language() {

	}

	public Language(String lang, Drawable image) {
		this.lang = lang;
		this.image = image;
	}

	public String getLang() {
		return lang;
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	public Drawable getImage() {
		return image;
	}

	public void setImage(Drawable image) {
		this.image = image;
	}
}
