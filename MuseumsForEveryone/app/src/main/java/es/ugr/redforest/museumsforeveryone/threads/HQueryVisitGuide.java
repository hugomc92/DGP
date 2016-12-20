package es.ugr.redforest.museumsforeveryone.threads;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.widget.DefaultItemAnimator;
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

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterVisitGuide;
import es.ugr.redforest.museumsforeveryone.models.GuidedVisit;
import es.ugr.redforest.museumsforeveryone.models.Location;
import es.ugr.redforest.museumsforeveryone.screens.ActivityArtworkDisplay;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;


/**
 * Thread to connect to the server and get the localization information
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */
public class HQueryVisitGuide extends AsyncTask<Void, Integer, String> {

        Context context;
        String resultado;
        ProgressDialog pDialog;
        ArrayList<Location> locations;
        String id="";


        public HQueryVisitGuide(Context c,String id) {
            context=c;
            this.locations = new ArrayList<>();
            this.id = id;
        }

        @Override
        protected String doInBackground(Void... params) {
            ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            resultado = QueryBBDD.doQuery(QueryBBDD.queryGuideVisit+"/"+id+"/"+ ControllerPreferences.getLanguage(), "", "GET");
            JSONObject res =null;
            GuidedVisit itemGuidedVisit =null;
            try {
                if(resultado!=null) {
                    res = new JSONObject(resultado);
                    if (!res.isNull("visit")) {
                        JSONObject itemVisit = res.getJSONObject("visit");
                        JSONArray itemVisitInfo = res.getJSONArray("visit_info");
                        itemGuidedVisit = mapper.readValue(itemVisitInfo.getJSONObject(0).toString(), GuidedVisit.class);
                        itemGuidedVisit.setPhoto(itemVisit.getString("PHOTO"));
                        itemGuidedVisit.setId(itemVisit.getInt("ID"));

                        JSONArray visitlocation = res.getJSONArray("visit_locations");
                        for (int j = 0; j < visitlocation.length(); ++j) {
                            JSONObject item = visitlocation.getJSONObject(j);
                            JSONObject itemLocation = item.getJSONObject("location");
                            int itemOrder =  item.getInt("order");
                            Location location = mapper.readValue(itemLocation.toString(), Location.class);
                            location.setOrder(itemOrder);
                            locations.add(location);
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
            final RecyclerView recyclerGuidedVisit = (RecyclerView) ((Activity)context).findViewById(R.id.recycler_visit_guide);

            //Creates an Adapter with the list of languages
            AdapterVisitGuide guidedVisitAdapter = new AdapterVisitGuide(locations,context);

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
            recyclerGuidedVisit.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


                @Override
                public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

                    View child = recyclerGuidedVisit.findChildViewUnder(e.getX(), e.getY());
                    if(child!=null && mGestureDetector.onTouchEvent(e)) {
                        Intent ActivityArtworkIntent = new Intent(context, ActivityArtworkDisplay.class);
                        ActivityArtworkIntent.putExtra("id", locations.get(recyclerGuidedVisit.getChildAdapterPosition(child)).getId());
                        ((Activity)context).startActivity(ActivityArtworkIntent);
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
            recyclerGuidedVisit.setLayoutManager(layMan);
            recyclerGuidedVisit.setItemAnimator(new DefaultItemAnimator());
            recyclerGuidedVisit.setAdapter(guidedVisitAdapter);
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

