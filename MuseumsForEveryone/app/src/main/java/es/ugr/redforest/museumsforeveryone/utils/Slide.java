package es.ugr.redforest.museumsforeveryone.utils;

import android.graphics.Color;
import android.support.annotation.ColorInt;
import android.support.v4.app.Fragment;

import com.github.paolorotolo.appintro.ISlideBackgroundColorHolder;

/**
 * Created by mrsas on 15/12/2016.
 */
public final class Slide extends Fragment implements ISlideBackgroundColorHolder {
    public ISlideBackgroundColorHolder layoutContainer = this;
    @Override
    public int getDefaultBackgroundColor() {
        // Return the default background color of the slide.
        return Color.parseColor("#000000");
    }

    @Override
    public void setBackgroundColor(@ColorInt int backgroundColor) {
        // Set the background color of the view within your slide to which the transition should be applied.

        if (layoutContainer != null) {
            layoutContainer.setBackgroundColor(backgroundColor);
        }
    }
}
