package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.content.SharedPreferences;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;

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
		setContentView(R.layout.activity_accessibility2);
	}

	/**
	 * On click set accessibility preference, vision problems
	 *
	 * @author Julian Torices Hernandez
	 * @author Miguel Ángel Torres López
	 * @version 1.0.0
	 */
	public void buttonVisionProblems(View v){
		ControllerPreferences preferences= ControllerPreferences.getInstance();
		preferences.savePreferencesDisability(this,1);
		Intent instructionIntent = new Intent(ActivityAccessibility.this, ActivityInstructionsSightProblems.class);
		instructionIntent.putExtra("FirstTime","True");
		startActivity(instructionIntent);
	}

	/**
	 * On click set accessibility preference, hearing problems
	 *
	 * @author Julian Torices Hernandez
	 * @version 1.0.0
	 */
	public void buttonHearingProblems(View v){
		ControllerPreferences preferences= ControllerPreferences.getInstance();
		preferences.savePreferencesDisability(this,2);
		Intent instructionIntent = new Intent(ActivityAccessibility.this, ActivityInstructions.class);
		instructionIntent.putExtra("FirstTime","True");
		startActivity(instructionIntent);
	}
}
