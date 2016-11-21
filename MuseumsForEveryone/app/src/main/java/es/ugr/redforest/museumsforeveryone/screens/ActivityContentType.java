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
import es.ugr.redforest.museumsforeveryone.adapters.AdapterContentType;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.threads.HQueryContentType;

/**
 * Activity which shows a list of available artwork types to select one of them
 *
 * @author Juan José Jiménez García
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */
public class ActivityContentType extends AppCompatActivity {

    private ArrayList<ContentType> contentTypeList;   //List of artworks available

    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_content_type);

        context=this;

        contentTypeList =new ArrayList<>();

        //Gets reference of the RecyclerView
        final RecyclerView recyclerContentType = (RecyclerView) findViewById(R.id.recycler_content_type);

        HQueryContentType hQueryContentType = new HQueryContentType(this,contentTypeList);
        hQueryContentType.execute();

        //Creates an Adapter with the list of
        AdapterContentType contentTypeAdapter = new AdapterContentType(contentTypeList,this);

        //Creates an Android default layout to show elements on the RecyclerView
        LinearLayoutManager layMan = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL,
                false);

        //Assign an action to do on element click
		recyclerContentType.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


			@Override
			public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

				View child = recyclerContentType.findChildViewUnder(e.getX(), e.getY());
				Intent FirstViewIntent = new Intent(ActivityContentType.this, ActivityFirstView.class);
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
        recyclerContentType.setLayoutManager(layMan);
        recyclerContentType.setItemAnimator(new DefaultItemAnimator());
        recyclerContentType.setAdapter(contentTypeAdapter);

        //DEBUGGING PURPOSES

    }
}