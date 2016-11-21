package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;

public class ActivitySplashScreen extends AppCompatActivity {

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
                    Intent intent = new Intent(ActivitySplashScreen.this, ActivityLang.class);
                    intent.putExtra("FirstTime","True");
                    startActivity(intent);
                }
            }, 3000);
        }
        else
        {
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    Intent intent = new Intent(ActivitySplashScreen.this, MainActivity.class);
                    startActivity(intent);
                }
            }, 3000);
        }
    }
}
