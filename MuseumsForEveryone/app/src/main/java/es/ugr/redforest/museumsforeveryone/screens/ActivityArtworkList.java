package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import es.ugr.redforest.museumsforeveryone.R;
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

    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_list);

        String id="";
        context=this;

        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializateToolbar(R.menu.menu_main,getString(R.string.app_name));
        Bundle bundle = getIntent().getExtras();
        if(bundle.containsKey("id_type"))
            id = String.valueOf(bundle.getInt("id_type"));

        //Query to bring all artworks
        HQueryArtworkList hQueryContentsInformation = new HQueryArtworkList(this,id);
        hQueryContentsInformation.execute();

    }
}
