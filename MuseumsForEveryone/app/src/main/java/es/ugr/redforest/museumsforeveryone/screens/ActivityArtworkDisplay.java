package es.ugr.redforest.museumsforeveryone.screens;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.Localization;
import es.ugr.redforest.museumsforeveryone.threads.HQueryContentOfLocalization;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

public class ActivityArtworkDisplay extends AppCompatActivity {

    String artworkName="";
    Localization localization= null;
    String languageCode="";
    String id="";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_display);
        SliderMenu mySlide = new SliderMenu(this,this);

        HQueryContentOfLocalization queryContent = new HQueryContentOfLocalization(this,localization,languageCode,id);
        queryContent.execute();
        
        mySlide.inicializarToolbar(R.menu.menu_main,artworkName);
    }
}
