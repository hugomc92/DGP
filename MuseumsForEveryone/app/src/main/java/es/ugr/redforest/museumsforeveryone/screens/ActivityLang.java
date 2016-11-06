package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.models.Language;
import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterLang;

/**
 * Activity which shows a list of available languages to select one of them
 *
 * @author Gregorio Carvajal Exposito
 * @version 1.0.0
 * @see Language
 */
public class ActivityLang extends AppCompatActivity {

	private ArrayList<Language> langList;   //List of languages available

	/**
	 * {@inheritDoc}
	 */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lang);

	    langList = new ArrayList<>();

	    //Gets reference of the RecyclerView
	    RecyclerView recyclerLang = (RecyclerView) findViewById(R.id.recycler_lang);

	    //Creates an Adapter with the list of languages
	    AdapterLang langAdapter = new AdapterLang(langList);

	    //Creates an Android default layout to show elements on the RecyclerView
	    LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
															 false);

	    //Assign an action to do on element click
	    langAdapter.setOnClickListener(new View.OnClickListener() {
		    @Override
		    public void onClick(View v) {
				//TODO: Establecer config de idioma
			    Intent FirstViewIntent = new Intent(ActivityLang.this, ActivityFirstView.class);
			    startActivity(FirstViewIntent);
		    }
	    });

	    //Set all previous elements to the RecyclerView
	    recyclerLang.setLayoutManager(layMan);
	    recyclerLang.setItemAnimator(new DefaultItemAnimator());
	    recyclerLang.setAdapter(langAdapter);

	    //DEBUGGING PURPOSES
	    loadLanguages();

    }

	/**
	 * Loads a few languages to the list
	 * Only for debugging purposes
	 */
	private void loadLanguages() {
		Language es = new Language("Español", R.drawable.spain);
		langList.add(es);

		Language en = new Language("English", R.drawable.english);
		langList.add(en);

		Language fr = new Language("Français", R.drawable.french);
		langList.add(fr);

		Language de = new Language("Deutsch", R.drawable.german);
		langList.add(de);
	}

}
