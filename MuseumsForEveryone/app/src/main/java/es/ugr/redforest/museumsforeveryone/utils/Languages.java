package es.ugr.redforest.museumsforeveryone.utils;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.util.DisplayMetrics;

import java.util.Locale;

/**
 * Created by Antonio Benitez Guijarro on 14/01/2017.
 */

public class Languages {

    public static void setLocale(String lang, Context context) {
        Locale myLocale = new Locale("es");
        switch (lang){
            case "de-DE":
                myLocale = Locale.GERMAN;
                break;
            case "es-ES":
                myLocale = new Locale("es");
                break;
            case "fr-FR":
                myLocale = Locale.FRENCH;
                break;
            case "en-GB":
                myLocale = Locale.ENGLISH;
                break;

        }

        Resources res = context.getResources();
        DisplayMetrics dm = res.getDisplayMetrics();
        Configuration conf = res.getConfiguration();
        conf.setLocale(myLocale);
        res.updateConfiguration(conf, dm);
    }
}
