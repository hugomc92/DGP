package es.ugr.redforest.museumsforeveryone.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by matl1995 on 19/11/16.
 */

public class ControllerPreferences {
    public static String language="";
    public static int disability=0;

    public static void  savePreferencesLanguage(Context t, String lan){
        SharedPreferences misprefe = t.getSharedPreferences("PrefUser", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = misprefe.edit();
        editor.putString("idioma",lan);
    }

    public static void  savePreferencesDisability(Context t, int dis){
        SharedPreferences misprefe = t.getSharedPreferences("PrefUser", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = misprefe.edit();
        editor.putInt("discapacidad",dis);
    }

    public static void loadPreferences(Context t){
        SharedPreferences misprefe = t.getSharedPreferences("PrefUser", Context.MODE_PRIVATE);
        language=misprefe.getString("idioma","español");
        disability=misprefe.getInt("discapacidad",0);
    }
}
