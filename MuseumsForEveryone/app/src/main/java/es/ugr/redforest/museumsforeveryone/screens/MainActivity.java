package es.ugr.redforest.museumsforeveryone.screens;

import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

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
		setContentView(R.layout.activity_main2);
		SliderMenu mySlide = new SliderMenu(this,this);
		mySlide.inicializateToolbar(R.menu.menu_main,getString(R.string.app_name));
	}

	@Override
	public void onBackPressed() {
		new AlertDialog.Builder(this).setMessage(R.string.exit_Message)
				.setCancelable(false)
				.setPositiveButton(R.string.yes, new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						finish();
                        System.exit(0);

					}
				})
				.setNegativeButton(R.string.No, null)
				.show();
	}

	/**
	 * Assign an action to do on element click
	 *
	 * @author Miguel Ángel Torres López
	 * @version 1.0.0
	 */
	public void launchArtworkListActivity(View v){
		Intent artWorkIntent = new Intent(MainActivity.this, ActivityContentType.class);
		startActivity(artWorkIntent);
	}

	/**
	 * Assign an action to do on element click
	 *
	 * @author Miguel Ángel Torres López
	 * @version 1.0.0
	 */
	public void launchGuidedVisit(View v){
		Intent guidedVisitIntent = new Intent(MainActivity.this, ActivityGuidedVisit.class);
		startActivity(guidedVisitIntent);
	}

	/**
	 * Assign an action to do on element click
	 *
	 * @author Miguel Ángel Torres López
	 * @version 1.0.0
	 */
	public void launchInfoObras(View v){
		Intent preferencesIntent = new Intent(MainActivity.this, ActivityRequestCameraPermission.class);
		startActivity(preferencesIntent);
	}
}
