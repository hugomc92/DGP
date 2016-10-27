package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Activity which shows two buttons about two types of accessibility
 *
 * @author Julian Torices Hernandez
 * @version 1.0.0
 */

public class ActivityInstructions extends AppCompatActivity {

	/**
	 * Depending on the type of accessibility display instructions
	 *
	 * @author Julian Torices Hernandez
	 * @version 1.0.0
	 */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_instructions);
	    //THIS IS THE PROTOTYPE, THIS WILL CHANGE
	    //If accessibility == 0 then load instructions
	    SharedPreferences prefs = getSharedPreferences("Preferences", Context.MODE_PRIVATE);
		int accessibility = prefs.getInt("accessibility",-1);
	    TextView instructions = (TextView) findViewById(R.id.instructions);

		switch (accessibility){
			case 0:
				instructions.append("Instrucciones sin discapacidad");
				break;
			case 1:
				instructions.append("Instrucciones problemas de visión");
				break;
			case 2:
				instructions.append("Instrucciones problemas auditivos");
				break;
			default:
				instructions.append("No se han cargado instrucciones");
		}
    }

	/**
	 * Assign an action to do on element click
	 *
	 * @author Julian Torices Hernandez
	 * @version 1.0.0
	 */
	public void launchMainActivity(View v){
		Intent mainIntent = new Intent(ActivityInstructions.this, MainActivity.class);
		startActivity(mainIntent);
	}
}
