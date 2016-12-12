package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.Location;
import es.ugr.redforest.museumsforeveryone.threads.HQueryContentOfLocalization;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

/**
 * Display artwork's content
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class ActivityArtworkDisplay extends AppCompatActivity {

    String artworkName="";
    Location location = null;
    String id="";
    Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_display);
        context = this;
        SliderMenu mySlide = new SliderMenu(this,this);

        Bundle bundle = getIntent().getExtras();
        //Content's index in a content's array
        int index =0;
        if(bundle.containsKey("index")){
            index = bundle.getInt("index");
        }
        if(bundle.containsKey("qrornfc")) {
            id = bundle.getString("qrornfc");
            HQueryContentOfLocalization queryContent = new HQueryContentOfLocalization(this, location, id,index,artworkName,true);
            queryContent.execute();
        }else if(bundle.containsKey("id"))
        {
            id = bundle.getString("id");
            HQueryContentOfLocalization queryContent = new HQueryContentOfLocalization(this, location, id,index,artworkName,false);
            queryContent.execute();
        }



        mySlide.inicializarToolbar(R.menu.menu_main, artworkName);
    }
}
