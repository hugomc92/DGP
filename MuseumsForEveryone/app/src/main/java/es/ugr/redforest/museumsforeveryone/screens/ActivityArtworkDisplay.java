package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.Localization;
import es.ugr.redforest.museumsforeveryone.threads.HQueryContentOfLocalization;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

/**
 * Display artwork's content
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class ActivityArtworkDisplay extends AppCompatActivity {

    String artworkName="";
    Localization localization= null;
    String languageCode="";
    String id="";
    Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_artwork_display);
        context = this;
        SliderMenu mySlide = new SliderMenu(this,this);

        Bundle bundle = getIntent().getExtras();
        int index =0;
        if(bundle.containsKey("index")){
            index = bundle.getInt("index");
        }
        if(bundle.containsKey("id")) {
            id = bundle.getString("id");

            languageCode = ControllerPreferences.getLanguage();

            HQueryContentOfLocalization queryContent = new HQueryContentOfLocalization(this, localization, languageCode, id,index,artworkName);
            queryContent.execute();
        }

        mySlide.inicializarToolbar(R.menu.menu_main, artworkName);
    }
}
