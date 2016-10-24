package es.ugr.redforest.museumsforeveryone;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;

public class FirtsViewActivity extends AppCompatActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_firts_view);
	}
	public void launchAccessibilityActivity(){
		Intent accessibilityIntent = new Intent(FirtsViewActivity.this,
				AccessibilityActivity.class);
		startActivity(accessibilityIntent);
	}
}
