package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;

public class ActivityAccessibilityPreferences extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_accesibility_preferences2);
    }

    /**
     * Assign an action to do on element click
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     */
    public void launchVisibility(View v){
        ControllerPreferences preferences= ControllerPreferences.getInstance();
        preferences.savePreferencesDisability(this,1);
        Intent preferencesIntent = new Intent(ActivityAccessibilityPreferences.this, ActivityPreferences.class);
        startActivity(preferencesIntent);
    }

    /**
     * Assign an action to do on element click
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     */
    public void launchHearing(View v){
        ControllerPreferences preferences= ControllerPreferences.getInstance();
        preferences.savePreferencesDisability(this,2);
        Intent preferencesIntent = new Intent(ActivityAccessibilityPreferences.this, ActivityPreferences.class);
        startActivity(preferencesIntent);
    }

    /**
     * Assign an action to do on element click
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     */
    public void launchNoAccessibility(View v){
        ControllerPreferences preferences= ControllerPreferences.getInstance();
        preferences.savePreferencesDisability(this,0);
        Intent preferencesIntent = new Intent(ActivityAccessibilityPreferences.this, ActivityPreferences.class);
        startActivity(preferencesIntent);
    }
}
