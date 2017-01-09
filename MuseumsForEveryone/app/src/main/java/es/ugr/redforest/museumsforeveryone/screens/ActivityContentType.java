package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.threads.HQueryContentType;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

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
        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializateToolbar(R.menu.menu_main,getString(R.string.app_name));

        HQueryContentType hQueryContentType = new HQueryContentType(this,contentTypeList);
        hQueryContentType.execute();


    }
}