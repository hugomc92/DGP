package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.google.android.exoplayer2.DefaultLoadControl;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.LoadControl;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.trackselection.AdaptiveVideoTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.TrackSelection;
import com.google.android.exoplayer2.trackselection.TrackSelector;
import com.google.android.exoplayer2.upstream.BandwidthMeter;
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter;

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

    String id="";
    Context context;
    SimpleExoPlayer player;

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
        // 1. Create a default TrackSelector
        BandwidthMeter bandwidthMeter = new DefaultBandwidthMeter();
        TrackSelection.Factory videoTrackSelectionFactory =
                new AdaptiveVideoTrackSelection.Factory(bandwidthMeter);
        TrackSelector trackSelector =
                new DefaultTrackSelector(videoTrackSelectionFactory);
        // 2. Create a default LoadControl
        LoadControl loadControl = new DefaultLoadControl();
        // 3. Create the player
        player = ExoPlayerFactory.newSimpleInstance(context, trackSelector, loadControl);

        if(bundle.containsKey("qrornfc")) {
            id = bundle.getString("qrornfc");
            HQueryContentOfLocalization queryContent = new HQueryContentOfLocalization(this, id,index,mySlide,true,player);
            queryContent.execute();
        }else if(bundle.containsKey("id"))
        {
            id = String.valueOf(bundle.getInt("id"));
            HQueryContentOfLocalization queryContent = new HQueryContentOfLocalization(this, id,index,mySlide,false,player);
            queryContent.execute();
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        if(player!=null){
            player.stop();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(player!=null){
            player.stop();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        if(player!=null){
            player.stop();
        }
    }
}
