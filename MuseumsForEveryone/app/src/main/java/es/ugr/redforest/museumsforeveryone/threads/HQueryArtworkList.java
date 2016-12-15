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
import es.ugr.redforest.museumsforeveryone.adapters.AdapterArtworkList;
import es.ugr.redforest.museumsforeveryone.models.Content;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.models.Multimedia;
import es.ugr.redforest.museumsforeveryone.screens.ActivityArtworkDisplay;
import es.ugr.redforest.museumsforeveryone.screens.ActivityArtworkList;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;

/**
 * Thread to connect to the server and get the localization information
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class HQueryArtworkList extends AsyncTask<Void, Integer, String> {
    Context context;
    String result;
    ProgressDialog pDialog;
    ArrayList<ContentInformation> contentInformationList;
    ArrayList<Content> contents;
    String typeContent="";


    public HQueryArtworkList(Context c , String typeContent) {
        this.context=c;
        this.contentInformationList = new ArrayList<>();
        this.typeContent = typeContent;
        this.contents = new ArrayList<>();

    }

    @Override
    protected String doInBackground(Void... params) {
        ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        result = QueryBBDD.doQuery(QueryBBDD.queryContentInformationOfType+"/"+typeContent+"/"+ ControllerPreferences.getLanguage(), "", "GET");
        JSONObject res =null;
        ContentInformation contentInformation =null;
        Content content =null;
        try {
            if(result !=null) {
                res = new JSONObject(result);
                if (!res.isNull("contents")) {
                    JSONArray contentType = res.getJSONArray("contents");

                    for (int j = 0; j < contentType.length(); ++j) {
                        JSONObject item = contentType.getJSONObject(j);
                        JSONObject itemContentInformation = item.getJSONObject("content_information");

                        JSONObject itemContent = item.getJSONObject("content");
                        content = mapper.readValue(itemContent.toString(), Content.class);

                        contentInformation = mapper.readValue(itemContentInformation.toString(), ContentInformation.class);

                        contentInformationList.add(contentInformation);

                        //Add images to content
                        if(item.has("images")) {
                            JSONArray imagesJson = item.getJSONArray("images");
                            for (int i = 0; i < imagesJson.length(); ++i) {
                                JSONObject imageJson = imagesJson.getJSONObject(i);
                                JSONObject imgJson = imageJson.getJSONObject("image");
                                Multimedia image = mapper.readValue(imgJson.toString(), Multimedia.class);
                                image.setType("image");
                                image.setAlternativeText(imageJson.getString("alt_text"));
                                content.addMultimedia(image);
                            }
                        }
                        contents.add(content);
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
        return result;
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
            final RecyclerView recyclerContentInformation = (RecyclerView) ((Activity)context).findViewById(R.id.recycler_artwork_list);

            //Creates an Adapter with the list of languages
            AdapterArtworkList contentInformationAdapter = new AdapterArtworkList(contentInformationList,contents,context);

            //Creates an Android default layout to show elements on the RecyclerView
            LinearLayoutManager layMan = new LinearLayoutManager(context, LinearLayoutManager.VERTICAL,
                    false);

            //Add line decoration to RecyclerView
            DividerItemDecoration mDividerItemDecoration = new DividerItemDecoration(recyclerContentInformation.getContext(),
                    layMan.getOrientation());
            recyclerContentInformation.addItemDecoration(mDividerItemDecoration);
            //Find selection point on recyclerview
            final GestureDetector mGestureDetector = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {

                @Override public boolean onSingleTapUp(MotionEvent e) {
                    return true;
                }

            });

            //Assign an action to do on element click
            recyclerContentInformation.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {


                @Override
                public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

                    View child = recyclerContentInformation.findChildViewUnder(e.getX(), e.getY());
                    if(child!=null && mGestureDetector.onTouchEvent(e)) {
                        Intent ActivityArtworkDisplayIntent = new Intent(context, ActivityArtworkDisplay.class);
                        ActivityArtworkDisplayIntent.putExtra("id",  contents.get(recyclerContentInformation.getChildAdapterPosition(child)).getId());
                        ((Activity)context).startActivity(ActivityArtworkDisplayIntent);
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
            recyclerContentInformation.setLayoutManager(layMan);
            recyclerContentInformation.setItemAnimator(new DefaultItemAnimator());
            recyclerContentInformation.setAdapter(contentInformationAdapter);
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
