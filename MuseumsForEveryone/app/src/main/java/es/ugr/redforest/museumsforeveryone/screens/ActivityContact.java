package es.ugr.redforest.museumsforeveryone.screens;

import android.support.v7.app.AppCompatActivity;
import android.net.Uri;
import android.os.Bundle;
import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

/**
 * Created by Sasu on 20/12/2016.
 */

public class ActivityContact extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact);
        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializateToolbar(R.menu.menu_main,getString(R.string.contact));
        Button startBtn = (Button) findViewById(R.id.sendEmail);
        startBtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                sendEmail();
            }
        });
    }

    @Override
    public void onBackPressed() {
        Intent mainIntent = new Intent(this, MainActivity.class);
        mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(mainIntent);

    }

    protected void sendEmail() {
        Log.i(getString(R.string.send_email), "");
        String[] TO = {"redforestrf@gmail.com"};
        EditText topic = (EditText) findViewById(R.id.input_topic);
        EditText name = (EditText) findViewById(R.id.input_name);
        EditText email = (EditText) findViewById(R.id.input_email);
        EditText telephone = (EditText) findViewById(R.id.input_phone);
        EditText message = (EditText) findViewById(R.id.input_message);
        String[] CC = {getString(R.string.CC)+topic.getText().toString()};
        Intent emailIntent = new Intent(Intent.ACTION_SEND);

        emailIntent.setData(Uri.parse("mailto:"));
        emailIntent.setType("text/plain");
        emailIntent.putExtra(Intent.EXTRA_EMAIL, TO);
        emailIntent.putExtra(Intent.EXTRA_CC, CC);
        emailIntent.putExtra(Intent.EXTRA_SUBJECT, topic.getText().toString());
        emailIntent.putExtra(Intent.EXTRA_TEXT, "Datos de contacto:\n Nombre: "+ name.getText().toString() + "\nTeléfono: "+ telephone.getText().toString() + "\nEmail: " + email.getText().toString() + "\n\n" + message.getText().toString());

        try {
            startActivity(Intent.createChooser(emailIntent, getString(R.string.send_email)));
            finish();
            Log.i(getString(R.string.email_sent), "");
        } catch (android.content.ActivityNotFoundException ex) {
            Toast.makeText(this, R.string.email_error, Toast.LENGTH_SHORT).show();
        }
    }
}


