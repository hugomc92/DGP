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

import es.ugr.redforest.museumsforeveryone.adapters.AdapterGuidedVisit;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterLang;
import es.ugr.redforest.museumsforeveryone.models.GuidedVisit;
import es.ugr.redforest.museumsforeveryone.threads.HQueryMarkers;

/**
 * Activity which shows a list of available guided visits to select one of them
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 * @see GuidedVisit
 */

public class GuidedVisitActivity extends AppCompatActivity {

    private ArrayList<GuidedVisit> guidedVisitList;   //List of guided visits available

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_guided_visit);

        guidedVisitList = new ArrayList<>();

        //Gets reference of the RecyclerView
        RecyclerView recyclerGuidedVisit = (RecyclerView) findViewById(R.id.recycler_guided_visit);

        //Creates an Adapter with the list of languages
        AdapterGuidedVisit guidedVisitAdapter = new AdapterGuidedVisit(guidedVisitList);

        //Creates an Android default layout to show elements on the RecyclerView
        LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
                false);

        //Assign an action to do on element click
        guidedVisitAdapter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: Establecer config de idioma
                Intent FirstViewIntent = new Intent(GuidedVisitActivity.this, ActivityFirstView.class);
                startActivity(FirstViewIntent);
            }
        });

        //Set all previous elements to the RecyclerView
        recyclerGuidedVisit.setLayoutManager(layMan);
        recyclerGuidedVisit.setItemAnimator(new DefaultItemAnimator());
        recyclerGuidedVisit.setAdapter(guidedVisitAdapter);

        //DEBUGGING PURPOSES
        HQueryMarkers hQueryMarkers = new HQueryMarkers(this);
        hQueryMarkers.execute();
    }
}
