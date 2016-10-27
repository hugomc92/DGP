package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.content.SharedPreferences;

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Activity which shows two buttons about two types of accessibility
 *
 * @author Julian Torices Hernandez
 * @version 1.0.0
 */

public class ActivityAccessibility extends AppCompatActivity {

	/**
	 * {@inheritDoc}
	 */
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_accessibility);
	}

	/**
	 * On click set accessibility preference, vision problems
	 *
	 * @author Julian Torices Hernandez
	 * @version 1.0.0
	 */
	public void buttonVisionProblems(View v){
		SharedPreferences prefs = getSharedPreferences("Preferences", Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = prefs.edit();
		editor.putInt("accessibility",1);
		editor.commit();
		Intent instructionIntent = new Intent(ActivityAccessibility.this, ActivityInstructions.class);
		startActivity(instructionIntent);
	}

	/**
	 * On click set accessibility preference, hearing problems
	 *
	 * @author Julian Torices Hernandez
	 * @version 1.0.0
	 */
	public void buttonHearingProblems(View v){
		SharedPreferences prefs = getSharedPreferences("Preferences", Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = prefs.edit();
		editor.putInt("accessibility",2);
		editor.commit();
		Intent instructionIntent = new Intent(ActivityAccessibility.this, ActivityInstructions.class);
		startActivity(instructionIntent);
	}
}
