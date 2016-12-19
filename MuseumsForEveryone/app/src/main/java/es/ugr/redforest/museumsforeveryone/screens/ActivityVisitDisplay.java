package es.ugr.redforest.museumsforeveryone.screens;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.threads.HQueryVisitGuide;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

public class ActivityVisitDisplay extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_visit_display);
        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializarToolbar(R.menu.menu_main, "Visita Guiada");
        Bundle bundle = getIntent().getExtras();
        if(bundle.containsKey("id")) {
            String id = String.valueOf(bundle.getInt("id"));
            HQueryVisitGuide hQueryVisitGuide = new HQueryVisitGuide(this,id);
            hQueryVisitGuide.execute();
        }
    }
}
