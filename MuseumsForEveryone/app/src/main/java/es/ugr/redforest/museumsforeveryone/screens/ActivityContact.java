package es.ugr.redforest.museumsforeveryone.screens;

import android.support.v7.app.AppCompatActivity;
import android.net.Uri;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Created by Sasu on 20/12/2016.
 */

public class ActivityContact extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact);

        Button startBtn = (Button) findViewById(R.id.sendEmail);
        startBtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                sendEmail();
            }
        });
    }

    protected void sendEmail() {
        Log.i(getString(R.string.send_email), "");
        String[] TO = {"redforestrf@gmail.com"};
        String[] CC = {getString(R.string.CC)};
        Intent emailIntent = new Intent(Intent.ACTION_SEND);

        emailIntent.setData(Uri.parse("mailto:"));
        emailIntent.setType("text/plain");
        emailIntent.putExtra(Intent.EXTRA_EMAIL, TO);
        emailIntent.putExtra(Intent.EXTRA_CC, CC);
        emailIntent.putExtra(Intent.EXTRA_SUBJECT, getString(R.string.subject));
        emailIntent.putExtra(Intent.EXTRA_TEXT, getString(R.string.email_content));

        try {
            startActivity(Intent.createChooser(emailIntent, getString(R.string.send_email)));
            finish();
            Log.i(getString(R.string.email_sent), "");
        } catch (android.content.ActivityNotFoundException ex) {
            Toast.makeText(this, R.string.email_error, Toast.LENGTH_SHORT).show();
        }
    }
}


