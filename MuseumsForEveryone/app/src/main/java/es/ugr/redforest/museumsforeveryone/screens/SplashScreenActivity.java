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

        ControllerPreferences preferences= ControllerPreferences.getInstance();

        preferences.loadPreferences(this);

        if(preferences.isFirtsTime()) {
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
