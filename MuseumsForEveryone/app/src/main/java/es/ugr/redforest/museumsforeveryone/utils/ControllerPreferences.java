package es.ugr.redforest.museumsforeveryone.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by matl1995 on 19/11/16.
 */

public class ControllerPreferences {
    private static ControllerPreferences instance = new ControllerPreferences();
    private static String language="";
    private static int disability=0;
    private static boolean firstTime=false;

    public static ControllerPreferences getInstance() {
        return instance;
    }

    //No se si este metodo es util
    private ControllerPreferences() {
        //SharedPreferences prefs = getSharedPreferences("ControllerPreferences", Context.MODE_PRIVATE);
        //disability=prefs.getInt("accesibility", -1);
        //language=prefs.getString("language","");
        //firtsTime=prefs.getBoolean("first-time",false);
    }


    public static void  savePreferencesLanguage(Context t, String lan){
        SharedPreferences misprefe = t.getSharedPreferences("PrefUser", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = misprefe.edit();
        editor.putString("language",lan);
        editor.commit();
        language=lan;
    }

    public static void  savePreferencesDisability(Context t, int dis){
        SharedPreferences misprefe = t.getSharedPreferences("PrefUser", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = misprefe.edit();
        editor.putInt("accesibility",dis);
        editor.commit();
        disability=dis;
    }

    public static void  savePreferencesFirstTime(Context t, boolean first){
        SharedPreferences misprefe = t.getSharedPreferences("PrefUser", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = misprefe.edit();
        editor.putBoolean("first-time",first);
        editor.commit();
        firstTime=first;
    }

    public static void loadPreferences(Context t){
        SharedPreferences misprefe = t.getSharedPreferences("PrefUser", Context.MODE_PRIVATE);
        language=misprefe.getString("language","");
        disability=misprefe.getInt("accesibility",-1);
        firstTime=misprefe.getBoolean("first-time",false);
    }

    public static String getLanguage() {
        return language;
    }

    public static int getDisability() {
        return disability;
    }

    public static boolean isFirtsTime() {
        return firstTime;
    }
}
