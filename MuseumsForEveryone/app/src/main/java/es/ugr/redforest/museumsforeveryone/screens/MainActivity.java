package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Activity which shows two buttons about two types of accessibility
 *
 * @author Julian Torices Hernandez
 * @version 1.0.0
 */

public class MainActivity extends AppCompatActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
	}
	//Disable back button
	@Override
	public void onBackPressed() {
	}

	/** Called when the user clicks the Artwork List button */
	public void openArtworkList(View view) {
		Intent intent = new Intent(this, ArtworkListActivity.class);
		startActivity(intent);
	}
}
