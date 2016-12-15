package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.View;

import com.github.paolorotolo.appintro.AppIntro;
import com.github.paolorotolo.appintro.AppIntroFragment;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Created by mrsas on 15/12/2016.
 */
public class ActivityInstructionsSlides extends AppIntro {
    private int index = 0;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Note here that we DO NOT use setContentView();

        // Add your slide fragments here.
        // AppIntro will automatically generate the dots indicator and buttons.
        /*
        addSlide(firstFragment);
        addSlide(secondFragment);
        addSlide(thirdFragment);
        addSlide(fourthFragment);
        */
        /*

        // Instead of fragments, you can also use our default slide
        // Just set a title, description, background and image. AppIntro will do the rest.
        addSlide(AppIntroFragment.newInstance(title, description, image, backgroundColor));

        */

        ArrayList<Integer> colors = new ArrayList<>();
        colors.add(getResources().getColor(R.color.colorPrimaryDark));
        colors.add(getResources().getColor(R.color.colorPrimarySoft));
        colors.add(getResources().getColor(R.color.colorPrimary));

        addSlide(AppIntroFragment.newInstance("Prueba", "Hola hola 1", R.drawable.icon, getResources().getColor(R.color.colorPrimaryDark)));
        addSlide(AppIntroFragment.newInstance("Prueba2", "Hola hola 2", R.drawable.icon, getResources().getColor(R.color.colorPrimarySoft)));
        addSlide(AppIntroFragment.newInstance("Prueba3", "Hola hola 3", R.drawable.icon, getResources().getColor(R.color.colorPrimary)));
        // OPTIONAL METHODS
        // Override bar/separator color.
        /*
        setBarColor(Color.parseColor("#colo"));
        setSeparatorColor(Color.parseColor("#2196F3"));*/
        setSeparatorColor(getResources().getColor(R.color.colorPrimaryDark));

        // Hide Skip/Done button.
        for(int i =0; i < colors.size(); i++){

        }

        showSkipButton(true);
        setProgressButtonEnabled(true);

        // Turn vibration on and set intensity.
        // NOTE: you will probably need to ask VIBRATE permission in Manifest.
        setVibrate(true);
        setVibrateIntensity(30);
        setFadeAnimation();
    }

    public void launchMainActivity(){
        Intent myIntent = getIntent(); // gets the previously created intent
        String firstTime = myIntent.getStringExtra("FirstTime");
        if(firstTime.equals("True"))
        {
            Intent MainIntent = new Intent(this, MainActivity.class);
            startActivity(MainIntent);
        }
        else
        {
            Intent PreferencesIntent = new Intent(this, ActivityPreferences.class);
            startActivity(PreferencesIntent);
        }
    }

    @Override
    public void onSkipPressed(Fragment currentFragment) {
        super.onSkipPressed(currentFragment);
        launchMainActivity();
        // Do something when users tap on Skip button.
    }

    @Override
    public void onDonePressed(Fragment currentFragment) {
        super.onDonePressed(currentFragment);
        launchMainActivity();
        // Do something when users tap on Done button.

    }

    @Override
    public void onSlideChanged(@Nullable Fragment oldFragment, @Nullable Fragment newFragment) {
        super.onSlideChanged(oldFragment, newFragment);
        setSeparatorColor(getResources().getColor(R.color.colorPrimaryDark));
        // Do something when the slide changes.
    }
}

