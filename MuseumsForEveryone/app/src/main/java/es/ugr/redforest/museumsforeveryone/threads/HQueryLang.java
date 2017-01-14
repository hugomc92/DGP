package es.ugr.redforest.museumsforeveryone.threads;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.AsyncTask;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.DisplayMetrics;
import android.view.GestureDetector;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Toast;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterContentType;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterLang;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.models.Language;
import es.ugr.redforest.museumsforeveryone.screens.ActivityArtworkList;
import es.ugr.redforest.museumsforeveryone.screens.ActivityInstructionsSlides;
import es.ugr.redforest.museumsforeveryone.screens.ActivityLang;
import es.ugr.redforest.museumsforeveryone.screens.ActivityPreferences;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.Languages;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;


/**
 * Thread to connect to the server and get the localization information
 * @author Antonio Benitez Guijarro
 * @version 1.0.0
 */
public class HQueryLang extends AsyncTask<Void, Integer, String> {

        Context context;
        String resultado;
        ProgressDialog pDialog;
        ArrayList<Language> languages;


        public HQueryLang(Context c , ArrayList<Language> LanguageList) {
            context=c;
            this.languages = LanguageList;
        }

        @Override
        protected String doInBackground(Void... params) {
            ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            //Esta es la consulta real
            //resultado = QueryBBDD.doQuery(QueryBBDD.queryType+"/"+ ControllerPreferences.getLanguage(), "", "GET");
            //Esto es solo para pruebas
            resultado = QueryBBDD.doQuery(QueryBBDD.queryLang, "", "GET");
            JSONArray res =null;
            Language language =null;
            try {
                if(resultado!=null) {
                    res = new JSONArray(resultado);
                    if (res.length()!=0) {
                        for (int j = 0; j < res.length(); ++j) {
                            JSONObject item = res.getJSONObject(j);
                            language = mapper.readValue(item.toString(), Language.class);
                            //language = new Language(item.getString("NAME"),item.getString("FLAG"),item.getString("CODE"));
                            languages.add(language);
                        }
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            } catch (JsonParseException e) {
                e.printStackTrace();
            } catch (JsonMappingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return resultado;
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            // durante la ejecucion -- para la barra
        }
    @Override
    protected void onPostExecute(String resultado) {

        if (resultado==null || resultado.compareTo("")==0) {
            Toast toast = Toast.makeText(context,
                    R.string.conection_Problems,
                    Toast.LENGTH_SHORT);
            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 0);
            toast.show();
        }else{
            //Gets reference of the RecyclerView
            final RecyclerView recyclerLang = (RecyclerView) ((Activity)context).findViewById(R.id.recycler_lang);


            //Creates an Adapter with the list of
            AdapterLang LangAdapter = new AdapterLang(languages,context);

            //Creates an Android default layout to show elements on the RecyclerView
            LinearLayoutManager layMan = new LinearLayoutManager(context, LinearLayoutManager.VERTICAL,
                    false);


            //Find selection point on recyclerview
            final GestureDetector mGestureDetector = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {

                @Override public boolean onSingleTapUp(MotionEvent e) {
                    return true;
                }

            });

            //Assign an action to do on element click
            recyclerLang.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


                @Override
                public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

                    View child = recyclerLang.findChildViewUnder(e.getX(), e.getY());
                    if(child!=null && mGestureDetector.onTouchEvent(e)) {

                        Intent myIntent = ((Activity)context).getIntent(); // gets the previously created intent
                        String firstTime = myIntent.getStringExtra("FirstTime");

                        String Lang_code = languages.get(recyclerLang.getChildAdapterPosition(child)).getCode();
                        if(firstTime.equals("True"))
                        {
                            ControllerPreferences preferences= ControllerPreferences.getInstance();
                            preferences.savePreferencesLanguage(context,Lang_code);
                            Languages.setLocale(Lang_code,context);
                            Intent FirstViewIntent = new Intent(context, ActivityInstructionsSlides.class);
                        ((Activity)context).startActivity(FirstViewIntent);
                        }
                        else
                        {
                            ControllerPreferences preferences= ControllerPreferences.getInstance();
                            preferences.savePreferencesLanguage(context,Lang_code);
                            Languages.setLocale(Lang_code,context);
                            Intent PreferencesIntent = new Intent(context, ActivityPreferences.class);
                            ((Activity)context).startActivity(PreferencesIntent);
                        }

                    }
                    return false;
                }

                @Override
                public void onTouchEvent(RecyclerView rv, MotionEvent e) {

                }

                @Override
                public void onRequestDisallowInterceptTouchEvent(boolean disallowIntercept) {

                }
            });

            //Set all previous elements to the RecyclerView
            recyclerLang.setLayoutManager(layMan);
            recyclerLang.setItemAnimator(new DefaultItemAnimator());
            recyclerLang.setAdapter(LangAdapter);

            //DEBUGGING PURPOSES
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

