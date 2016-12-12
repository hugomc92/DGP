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
import es.ugr.redforest.museumsforeveryone.models.Content;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.threads.HQueryArtworkList;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;


/**
 * Activity which shows a list of available artworks to select one of them
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */
public class ActivityArtworkList extends AppCompatActivity {

    private ArrayList<ContentInformation> contents;   //List of artworks available

    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_list);
        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializarToolbar(R.menu.menu_main,getString(R.string.app_name));
        String id="";
        context=this;
        contents = new ArrayList<>();
        Bundle bundle = getIntent().getExtras();
        if(bundle.containsKey("id_type"))
            id = bundle.getString("id_type");

        //Query to bring all artworks
        HQueryArtworkList hQueryContentsInformation = new HQueryArtworkList(this,contents,id);
        hQueryContentsInformation.execute();

        //Gets reference of the RecyclerView
        final RecyclerView recyclerContentInformation = (RecyclerView) findViewById(R.id.recycler_artwork_list);

        //Creates an Adapter with the list of languages
        AdapterContentInformation contentInformationAdapter = new AdapterContentInformation(contents);

        //Creates an Android default layout to show elements on the RecyclerView
        LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
                false);

        //Assign an action to do on element click
        recyclerContentInformation.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


            @Override
            public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

                View child = recyclerContentInformation.findChildViewUnder(e.getX(), e.getY());
                if(child!=null) {
                    Intent ActivityArtworkDisplayIntent = new Intent(ActivityArtworkList.this, ActivityArtworkDisplay.class);
                    ActivityArtworkDisplayIntent.putExtra("id", recyclerContentInformation.getChildAdapterPosition(child));
                    startActivity(ActivityArtworkDisplayIntent);
                }
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

    }
}
