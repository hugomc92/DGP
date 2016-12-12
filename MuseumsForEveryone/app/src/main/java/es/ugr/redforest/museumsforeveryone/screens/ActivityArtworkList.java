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
import es.ugr.redforest.museumsforeveryone.adapters.AdapterArtworkList;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.models.Multimedia;
import es.ugr.redforest.museumsforeveryone.threads.HQueryArtworkList;
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
    private ArrayList<Multimedia> images;   //List of images of all artworks

    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_list);
        String id="";
        context=this;
        contents = new ArrayList<>();
        images = new ArrayList<>();
        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializarToolbar(R.menu.menu_main,getString(R.string.app_name));
        Bundle bundle = getIntent().getExtras();
        if(bundle.containsKey("id_type"))
            id = String.valueOf(bundle.getInt("id_type"));

        //Query to bring all artworks
        HQueryArtworkList hQueryContentsInformation = new HQueryArtworkList(this,contents,id,images);
        hQueryContentsInformation.execute();

    }
}
