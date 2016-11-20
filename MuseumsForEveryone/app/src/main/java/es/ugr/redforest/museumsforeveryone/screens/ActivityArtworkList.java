package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterContentInformation;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.threads.HQueryContentInformation;

/**
 * Activity which shows a list of available artworks to select one of them
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */
public class ActivityArtworkList extends AppCompatActivity {

    private ArrayList<ContentInformation> contentInformationList;   //List of artworks available

    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_list);

        context=this;

        contentInformationList =new ArrayList<>();

        //Gets reference of the RecyclerView
        final RecyclerView recyclerContentInformation = (RecyclerView) findViewById(R.id.recycler_artwork_list);

        //Creates an Adapter with the list of languages
        AdapterContentInformation contentInformationAdapter = new AdapterContentInformation(contentInformationList);

        //Creates an Android default layout to show elements on the RecyclerView
        LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
                false);

        //Assign an action to do on element click
        recyclerContentInformation.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


            @Override
            public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

                View child = recyclerContentInformation.findChildViewUnder(e.getX(), e.getY());
                Intent FirstViewIntent = new Intent(ActivityArtworkList.this, ActivityFirstView.class);
                startActivity(FirstViewIntent);
                return false;
            }

            @Override
            public void onTouchEvent(RecyclerView rv, MotionEvent e) {

            }

            @Override
            public void onRequestDisallowInterceptTouchEvent(boolean disallowIntercept) {

            }
        });

        //Set all previous elements to the RecyclerView
        recyclerContentInformation.setLayoutManager(layMan);
        recyclerContentInformation.setItemAnimator(new DefaultItemAnimator());
        recyclerContentInformation.setAdapter(contentInformationAdapter);

        //DEBUGGING PURPOSES
        HQueryContentInformation hQueryContentInformation = new HQueryContentInformation(this,contentInformationList);
        hQueryContentInformation.execute();

    }
}
