package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterArtWork;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterLang;
import es.ugr.redforest.museumsforeveryone.models.ArtWork;
import es.ugr.redforest.museumsforeveryone.threads.HQueryMarkers;

/**
 * Activity which shows a list of available artwork types to select one of them
 *
 * @author Juan José Jiménez García
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */
public class ArtworkListActivity extends AppCompatActivity {

    private ArrayList<ArtWork> artWorkList;   //List of artworks available

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_list);

        artWorkList=new ArrayList<>();

        //Gets reference of the RecyclerView
        RecyclerView recyclerArtWork = (RecyclerView) findViewById(R.id.recycler_artwork);

        //Creates an Adapter with the list of languages
        AdapterArtWork artWorkAdapter = new AdapterArtWork(artWorkList);

        //Creates an Android default layout to show elements on the RecyclerView
        LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
                false);

        //Assign an action to do on element click
        artWorkAdapter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: Establecer config de idiomas
                Intent FirstViewIntent = new Intent(ArtworkListActivity.this, ActivityFirstView.class);
                startActivity(FirstViewIntent);
            }
        });

        //Set all previous elements to the RecyclerView
        recyclerArtWork.setLayoutManager(layMan);
        recyclerArtWork.setItemAnimator(new DefaultItemAnimator());
        recyclerArtWork.setAdapter(artWorkAdapter);

        //DEBUGGING PURPOSES
        HQueryMarkers hQueryMarkers = new HQueryMarkers(this);
        hQueryMarkers.execute();
    }

}