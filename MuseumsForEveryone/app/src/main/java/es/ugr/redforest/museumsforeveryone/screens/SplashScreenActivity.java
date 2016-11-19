package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;

public class SplashScreenActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash_screen);

        ControllerPreferences preferences= new ControllerPreferences();

        SharedPreferences prefs = getSharedPreferences("ControllerPreferences", Context.MODE_PRIVATE);
        int accesibility=prefs.getInt("accesibility", -1);
        String language=prefs.getString("language","");

        if(accesibility==-1 && language=="") {
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    Intent intent = new Intent(SplashScreenActivity.this, ActivityLang.class);
                    startActivity(intent);
                }
            }, 3000);
        }
        else
        {
            //Here we set the preferences of controller preferences to their value saved in the shared preferences
            preferences.savePreferencesLanguage(this,prefs.getString("language", ""));
            preferences.savePreferencesDisability(this,prefs.getInt("accesibility", -1));

            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    Intent intent = new Intent(SplashScreenActivity.this, MainActivity.class);
                    startActivity(intent);
                }
            }, 3000);
        }
    }
}
