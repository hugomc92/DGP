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
import es.ugr.redforest.museumsforeveryone.models.GuidedVisit;

/**
 * Activity which shows a list of available guided visits to select one of them
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 * @see GuidedVisit
 */

public class ActivityGuidedVisit extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_guided_visit);


        //DEBUGGING PURPOSES
        //HQueryContentType hQueryContentType = new HQueryContentType(this);
        //hQueryContentType.execute();
    }
}
