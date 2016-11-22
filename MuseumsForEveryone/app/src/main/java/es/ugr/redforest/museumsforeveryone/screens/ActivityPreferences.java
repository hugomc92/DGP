package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import es.ugr.redforest.museumsforeveryone.R;

public class ActivityPreferences extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_preferences);
    }

    /**
     * Assign an action to do on element click
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     */
    public void launchLanguageActivity(View v){
        Intent languageIntent = new Intent(ActivityPreferences.this, ActivityLang.class);
        languageIntent.putExtra("FirstTime","False");
        startActivity(languageIntent);
    }

    /**
     * Assign an action to do on element click
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     */
    public void launchInstructionsActivity(View v){
        Intent instructionsIntent = new Intent(ActivityPreferences.this, ActivityInstructions.class);
        instructionsIntent.putExtra("FirstTime","False");
        startActivity(instructionsIntent);
    }

    /**
     * Assign an action to do on element click
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     */
    public void launchAccesibility(View v){
        Intent accessibilityIntent = new Intent(ActivityPreferences.this, ActivityAccessibilityPreferences.class);
        startActivity(accessibilityIntent);
    }
}
