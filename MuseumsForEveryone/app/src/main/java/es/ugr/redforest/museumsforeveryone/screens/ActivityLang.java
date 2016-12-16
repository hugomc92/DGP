package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.models.Language;
import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterLang;
import es.ugr.redforest.museumsforeveryone.threads.HQueryContentType;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;

/**
 * Activity which shows a list of available languages to select one of them
 *
 * @author Gregorio Carvajal Exposito
 * @version 1.0.0
 * @see Language
 */
public class ActivityLang extends AppCompatActivity {

	private ArrayList<Language> langList;   //List of languages available

	private Context context;


	/**
	 * {@inheritDoc}
	 */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lang);
		context=this;

	    langList = new ArrayList<>();

	    //Gets reference of the RecyclerView
	    final RecyclerView recyclerLang = (RecyclerView) findViewById(R.id.recycler_lang);

	    //Creates an Adapter with the list of languages
	    AdapterLang langAdapter = new AdapterLang(langList);

	    //Creates an Android default layout to show elements on the RecyclerView
	    LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
															 false);

	    //Assign an action to do on element click
		/*recyclerLang.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


			@Override
			public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

				View child = recyclerLang.findChildViewUnder(e.getX(), e.getY());
				Intent FirstViewIntent = new Intent(ActivityLang.this, ActivityFirstView.class);
				TextView texta=(TextView)child.findViewById(R.id.lang_txt);
				ControllerPreferences preferences=ControllerPreferences.getInstance();
				preferences.savePreferencesLanguage(context,texta.getText().toString());
				startActivity(FirstViewIntent);
				return false;
			}

			@Override
			public void onTouchEvent(RecyclerView rv, MotionEvent e) {

			}

			@Override
			public void onRequestDisallowInterceptTouchEvent(boolean disallowIntercept) {

			}
		});*/

		//Assign an action to do on element click
		langAdapter.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				//TODO: Establecer config de idiomas
				Intent myIntent = getIntent(); // gets the previously created intent
				String firstTime = myIntent.getStringExtra("FirstTime");
				if(firstTime.equals("True"))
				{
					ControllerPreferences preferences= ControllerPreferences.getInstance();
					preferences.savePreferencesLanguage(context,"es-es");
					Intent FirstViewIntent = new Intent(ActivityLang.this, ActivityInstructionsSlides.class);
					startActivity(FirstViewIntent);
				}
				else
				{
					ControllerPreferences preferences= ControllerPreferences.getInstance();
					preferences.savePreferencesLanguage(context,"es-es");
					Intent PreferencesIntent = new Intent(ActivityLang.this, ActivityPreferences.class);
					startActivity(PreferencesIntent);
				}
			}
		});

	    //Set all previous elements to the RecyclerView
	    recyclerLang.setLayoutManager(layMan);
	    recyclerLang.setItemAnimator(new DefaultItemAnimator());
	    recyclerLang.setAdapter(langAdapter);

	    //DEBUGGING PURPOSES
	    loadLanguages();
		//HQueryContentType hQueryContentType = new HQueryContentType(this);
		//hQueryContentType.execute();
    }

	/**
	 * Loads a few languages to the list
	 * Only for debugging purposes
	 */
	private void loadLanguages() {
		Language es = new Language("Español", R.drawable.spain,"es");
		langList.add(es);

		Language en = new Language("English", R.drawable.english,"en");
		langList.add(en);

		Language fr = new Language("Français", R.drawable.french,"fr");
		langList.add(fr);

		Language de = new Language("Deutsch", R.drawable.german,"de");
		langList.add(de);
	}

}
