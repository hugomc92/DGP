package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import es.ugr.redforest.museumsforeveryone.R;

public class ActivityInfoDisplay extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_info_display);
    }
    /**
     * Assign an action to do on element click
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     */
    public void launchInfoObras(View v){
        Intent qrScannerIntent = new Intent(ActivityInfoDisplay.this, ActivityQRScanner.class);
        startActivity(qrScannerIntent);
    }
}
