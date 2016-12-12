package es.ugr.redforest.museumsforeveryone.threads;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
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


import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterContentType;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.screens.ActivityArtworkList;
import es.ugr.redforest.museumsforeveryone.screens.ActivityContentType;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;


/**
 * Thread to connect to the server and get the localization information
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */
public class HQueryContentType extends AsyncTask<Void, Integer, String> {

        Context context;
        String resultado;
        ProgressDialog pDialog;
        ArrayList<ContentType> contentTypeList;


        public HQueryContentType(Context c , ArrayList<ContentType> contentTypeList) {
            context=c;
            this.contentTypeList = contentTypeList;
        }

        @Override
        protected String doInBackground(Void... params) {
            ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            //Esta es la consulta real
            //resultado = QueryBBDD.doQuery(QueryBBDD.queryType+"/"+ ControllerPreferences.getLanguage(), "", "GET");
            //Esto es solo para pruebas
            resultado = QueryBBDD.doQuery(QueryBBDD.queryType, "", "GET");
            JSONObject res =null;
            ContentType itemContentType =null;
            try {
                if(resultado!=null) {
                    res = new JSONObject(resultado);
                    if (!res.isNull("content_types")) {
                        JSONArray contentType = res.getJSONArray("content_types");

                        for (int j = 0; j < contentType.length(); ++j) {
                            JSONObject item = contentType.getJSONObject(j);
                            itemContentType = mapper.readValue(item.toString(), ContentType.class);
                            contentTypeList.add(itemContentType);
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
                    "Conection problems, try again",
                    Toast.LENGTH_SHORT);
            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 0);
            toast.show();
        }else{
            //Gets reference of the RecyclerView
            final RecyclerView recyclerContentType = (RecyclerView) ((Activity)context).findViewById(R.id.recycler_content_type);


            //Creates an Adapter with the list of
            AdapterContentType contentTypeAdapter = new AdapterContentType(contentTypeList,context);

            //Creates an Android default layout to show elements on the RecyclerView
            LinearLayoutManager layMan = new LinearLayoutManager(context, LinearLayoutManager.VERTICAL,
                    false);

            //Add line decoration to RecyclerView
            DividerItemDecoration mDividerItemDecoration = new DividerItemDecoration(recyclerContentType.getContext(),
                    layMan.getOrientation());
            recyclerContentType.addItemDecoration(mDividerItemDecoration);

            //Find selection point on recyclerview
            final GestureDetector mGestureDetector = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {

                @Override public boolean onSingleTapUp(MotionEvent e) {
                    return true;
                }

            });

            //Assign an action to do on element click
            recyclerContentType.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


                @Override
                public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

                    View child = recyclerContentType.findChildViewUnder(e.getX(), e.getY());
                    if(child!=null && mGestureDetector.onTouchEvent(e)) {
                        Intent ActivityArtworkListIntent = new Intent(context, ActivityArtworkList.class);
                        ActivityArtworkListIntent.putExtra("id_type", contentTypeList.get(recyclerContentType.getChildAdapterPosition(child)).getId());
                        ((Activity)context).startActivity(ActivityArtworkListIntent);
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
            recyclerContentType.setLayoutManager(layMan);
            recyclerContentType.setItemAnimator(new DefaultItemAnimator());
            recyclerContentType.setAdapter(contentTypeAdapter);

            //DEBUGGING PURPOSES
        }
        pDialog.dismiss();
    }


        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            pDialog = new ProgressDialog(context);
            pDialog.setMessage("Loading Data");
            pDialog.setCancelable(false);
            pDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
            pDialog.show();
        }



        @Override
        protected void onCancelled() {

        }




}

