package es.ugr.redforest.museumsforeveryone.screens;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;
import android.view.View;

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Activity which shows two buttons about accessibility or enter the museum
 *
 * @author Julian Torices Hernandez
 * @version 1.0.0
 */
public class ActivityFirtsView extends AppCompatActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_firts_view);
	}
	//Assign an action to do on element click
	public void launchAccessibilityActivity(View v){
		Intent accessibilityIntent = new Intent(ActivityFirtsView.this,
				ActivityAccessibility.class);
		startActivity(accessibilityIntent);
	}
}
