package es.ugr.redforest.museumsforeveryone.threads;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.media.MediaFormat;
import android.os.AsyncTask;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.GestureDetector;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Toast;
import android.widget.VideoView;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Locale;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterContentType;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.screens.ActivityArtworkList;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;
import es.ugr.redforest.museumsforeveryone.utils.Subtitles;

import static android.media.MediaFormat.MIMETYPE_TEXT_VTT;


/**
 * Thread to connect to the server and get the localization information
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */
public class HSubtitles extends AsyncTask<Void, Integer, InputStream> {

        Context context;
        String filepath;
        ProgressDialog pDialog;
        VideoView videoView;


        public HSubtitles(Context c , VideoView videoView,String filepath) {
            context=c;
            this.videoView=videoView;
            this.filepath =filepath;
        }

        @Override
        protected InputStream doInBackground(Void... params) {

            return Subtitles.getSubtitleSource(filepath,context);
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            // durante la ejecucion -- para la barra
        }
    @Override
    protected void onPostExecute(InputStream resultado) {

        if (resultado==null) {
            Toast toast = Toast.makeText(context,
                    R.string.conection_Problems,
                    Toast.LENGTH_SHORT);
            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 0);
            toast.show();
        }else{

                videoView.addSubtitleSource(resultado, MediaFormat.createSubtitleFormat(MIMETYPE_TEXT_VTT, Locale.ENGLISH.getLanguage()));
        }
        pDialog.dismiss();
    }


        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            pDialog = new ProgressDialog(context);
            pDialog.setMessage(context.getString(R.string.loading));
            pDialog.setCancelable(false);
            pDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
            pDialog.show();
        }



        @Override
        protected void onCancelled() {

        }




}

