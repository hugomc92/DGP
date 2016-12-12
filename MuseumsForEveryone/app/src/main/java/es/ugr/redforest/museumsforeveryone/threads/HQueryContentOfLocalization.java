package es.ugr.redforest.museumsforeveryone.threads;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.media.MediaFormat;
import android.widget.MediaController;
import android.net.Uri;
import android.os.AsyncTask;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.Content;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.models.Localization;
import es.ugr.redforest.museumsforeveryone.models.Multimedia;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;

/**
 * Thread to connect to the server and get the localization
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class HQueryContentOfLocalization extends AsyncTask<Void, Integer, String> {
    private Context context;
    private ProgressDialog pDialog;
    private Localization localization;
    private String id="";
    private int index=0;
    private String artworkName="";
    private static int indexImage=0;
    private boolean qrornfc=true;

    public HQueryContentOfLocalization(Context c , Localization localization, String id, int index, String artworkName,boolean qrornfc) {
        this.context=c;
        this.localization = localization;
        this.id = id;
        this.index = index;
        this.artworkName = artworkName;
        this.qrornfc = qrornfc;
    }

    @Override
    protected String doInBackground(Void... params) {
        String result;
        ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        String query = "";
        if(qrornfc)
            query = QueryBBDD.queryContentOfLocalization;
        else
            query = QueryBBDD.queryContent;

        result = QueryBBDD.doQuery(query +"/"+id+"/"+ ControllerPreferences.getLanguage(), "", "POST");
        JSONObject res =null;
        try {
            if(result !=null) {
                res = new JSONObject(result);
                if (!res.isNull("localization")) {
                    //Transform JSON localization to model localization
                    JSONObject loc = res.getJSONObject("localization");
                    localization =  mapper.readValue(loc.toString(), Localization.class);

                    ContentInformation itemContentInformation =null;
                    ContentType itemContentType =null;
                    Content content=null;
                    //Fetch array of contents
                    JSONArray contentsJSON = res.getJSONArray("contents");
                    for (int j = 0; j < contentsJSON.length(); ++j) {
                        JSONObject item = contentsJSON.getJSONObject(j);
                        //Transform JSON content to model content
                        JSONObject contentJson = item.getJSONObject("content");
                        content =  mapper.readValue(contentJson.toString(), Content.class);
                        //Transform JSON content infomration to model content infomration
                        JSONObject content_information = item.getJSONObject("content_information");
                        itemContentInformation = mapper.readValue(content_information.toString(), ContentInformation.class);
                        //Transform JSON content type to model content type
                        JSONObject content_type = item.getJSONObject("content_type");
                        itemContentType = mapper.readValue(content_type.toString(), ContentType.class);
                        //Add videos to content
                        JSONArray videosJson = item.getJSONArray("video");
                        for(int i=0;i<videosJson.length();++i) {
                            JSONObject videoJson = videosJson.getJSONObject(i);
                            Multimedia video = new Multimedia(videoJson.getInt("id"), videoJson.getString("url"), "video", videoJson.getString("subtitles"));
                            content.addMultimedia(video);
                        }
                        //Add images to content
                        JSONArray imagesJson = item.getJSONArray("images");
                        for(int i=0;i<imagesJson.length();++i) {
                            JSONObject imageJson = imagesJson.getJSONObject(i);
                            Multimedia image = new Multimedia(imageJson.getInt("id"), imageJson.getString("url"), "image", imageJson.getString("alt_image"));
                            content.addMultimedia(image);
                        }
                        //add content information and content type to content
                        content.setContentInformation(itemContentInformation);
                        content.setContentType(itemContentType);
                        //add content to localization
                        localization.addContent(content);
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
            pDialog.dismiss();
        }else
        {
            //Initialize all view in display
            final ImageView imageView = (ImageView) ((Activity)context).findViewById(R.id.imgArtwork);
            TextView typeArtWork = (TextView)  ((Activity)context).findViewById(R.id.typeArtWork);
            TextView titleArtwork = (TextView)  ((Activity)context).findViewById(R.id.titleArtwork);
            TextView descriptionArtwork = (TextView)  ((Activity)context).findViewById(R.id.descriptionArtwork);
            TextView titleImage = (TextView)  ((Activity)context).findViewById(R.id.titleImage);
            VideoView videoView = (VideoView)((Activity) context).findViewById(R.id.videoArtwork);

            //Obtains contents from this location
            Content content = localization.getContents().get(index);
            final ArrayList<Multimedia> imageMultimedia = content.getMultimediaByType("image");
            //Set image in imageview and description
            Picasso.with(context).load(imageMultimedia.get(0).getUrl()).into(imageView);
            imageView.setContentDescription(imageMultimedia.get(0).getAlternativeText());
            //If arrays only contains one image hide carrousel control else add listener to carrousel
            if(imageMultimedia.size()==1) {
                RelativeLayout relativeLayout =(RelativeLayout) ((Activity) context).findViewById(R.id.carrousel_images);
                relativeLayout.setVisibility(View.GONE);
            }else{
                Button previosImage = (Button)  ((Activity) context).findViewById(R.id.btPreviousImage);
                Button nextImage = (Button)  ((Activity) context).findViewById(R.id.btNextImage);
                previosImage.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        indexImage--;
                        if(indexImage<0){
                            indexImage = imageMultimedia.size();
                        }
                        Picasso.with(context).load(imageMultimedia.get(indexImage).getUrl()).into(imageView);
                        imageView.setContentDescription(imageMultimedia.get(indexImage).getAlternativeText());
                    }
                });
                nextImage.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        indexImage++;
                        if(indexImage>imageMultimedia.size()){
                            indexImage = 0;
                        }
                        Picasso.with(context).load(imageMultimedia.get(indexImage).getUrl()).into(imageView);
                        imageView.setContentDescription(imageMultimedia.get(indexImage).getAlternativeText());
                    }
                });
            }

            ArrayList<Multimedia> videoMultimedia = content.getMultimediaByType("video");
            //If array contains video put video and subtitles in videoview else hide videoview
            if(videoMultimedia.size()>0){
                Uri uri = Uri.parse(videoMultimedia.get(0).getUrl());
                videoView.setVideoURI(uri);
                MediaController mediaController = new MediaController(context);
                mediaController.setAnchorView(videoView);
                videoView.setMediaController(mediaController);
                try {
                    URL url = new URL(videoMultimedia.get(0).getSubtitle());
                    InputStream stream = url.openStream();
                    videoView.addSubtitleSource(stream, MediaFormat.createSubtitleFormat("text/vtt",ControllerPreferences.getLanguage()));
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }else
            {
                videoView.setVisibility(View.GONE);
            }
            //set values at textview
            typeArtWork.setText(content.getContentType().getName());
            titleArtwork.setText(content.getContentInformation().getName());
            descriptionArtwork.setText(content.getContentInformation().getDescription());
            artworkName = content.getContentType().getName();
            titleImage.setText(artworkName);
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
