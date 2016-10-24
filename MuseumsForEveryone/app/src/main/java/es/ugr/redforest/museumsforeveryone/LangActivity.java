package es.ugr.redforest.museumsforeveryone;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import java.util.ArrayList;

public class LangActivity extends AppCompatActivity {

	private ArrayList<Language> langList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lang);

	    langList = new ArrayList<>();
	    RecyclerView recyclerLang = (RecyclerView) findViewById(R.id.recycler_lang);
	    LangAdapter langAdapter = new LangAdapter(langList);
	    LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
															 false);

	    langAdapter.setOnClickListener(new View.OnClickListener() {
		    @Override
		    public void onClick(View v) {
				//TODO: Establecer config de idioma
			    Intent FirstViewIntent = new Intent(LangActivity.this, FirtsViewActivity.class);
			    startActivity(FirstViewIntent);
		    }
	    });

	    recyclerLang.setLayoutManager(layMan);
	    recyclerLang.setItemAnimator(new DefaultItemAnimator());
	    recyclerLang.setAdapter(langAdapter);

	    cargarIdiomas();    //SOLO PARA EL PROTOTIPO

    }

	private void cargarIdiomas() {
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
