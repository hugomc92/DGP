package es.ugr.redforest.museumsforeveryone.threads;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.net.Uri;
import android.os.AsyncTask;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultLoadControl;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.Format;
import com.google.android.exoplayer2.LoadControl;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.extractor.DefaultExtractorsFactory;
import com.google.android.exoplayer2.extractor.ExtractorsFactory;
import com.google.android.exoplayer2.source.ExtractorMediaSource;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.MergingMediaSource;
import com.google.android.exoplayer2.source.SingleSampleMediaSource;
import com.google.android.exoplayer2.trackselection.AdaptiveVideoTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.TrackSelection;
import com.google.android.exoplayer2.trackselection.TrackSelector;
import com.google.android.exoplayer2.ui.SimpleExoPlayerView;
import com.google.android.exoplayer2.upstream.BandwidthMeter;
import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter;
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory;
import com.google.android.exoplayer2.util.MimeTypes;
import com.google.android.exoplayer2.util.Util;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Locale;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.Content;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.models.Location;
import es.ugr.redforest.museumsforeveryone.models.Multimedia;
import es.ugr.redforest.museumsforeveryone.utils.ControllerPreferences;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

/**
 * Thread to connect to the server and get the location and contents in this location
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 */

public class HQueryContentOfLocalization extends AsyncTask<Void, Integer, String> {
    private Context context;
    private ProgressDialog pDialog;
    private Location location;
    private String id="";
    private int index=0;
    private String artworkName="";
    private static int indexImage=0;
    private static int indexVideo=0;
    private boolean qrornfc=true;
    private Content content=null;
    private SimpleExoPlayer player;
    private SliderMenu mySlide;

    public HQueryContentOfLocalization(Context c , String id, int index, SliderMenu mySlide, boolean qrornfc, SimpleExoPlayer player) {
        this.context=c;
        this.location = new Location();
        this.id = id;
        this.index = index;
        this.mySlide = mySlide;
        this.qrornfc = qrornfc;
        this.player = player;
    }

    @Override
    protected String doInBackground(Void... params) {
        String result;
        ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES).disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        String query = "";
        if(qrornfc)
            query = QueryBBDD.queryContentOfLocalization;
        else
            query = QueryBBDD.queryContent;

        result = QueryBBDD.doQuery(query +"/"+id+"/"+ ControllerPreferences.getLanguage(), "", "GET");
        JSONObject res =null;
        try {
            if(result !=null) {
                res = new JSONObject(result);
                if (!res.isNull("content") || !res.isNull("contents") ) {
                    //Transform JSON location to model location
                    if(!res.isNull("location")) {
                        JSONObject loc = res.getJSONObject("location");
                        location = mapper.readValue(loc.toString(), Location.class);
                    }
                    ContentInformation itemContentInformation =null;
                    ContentType itemContentType =null;

                    //Fetch array of contents
                    //If content is scan by nfc or qr gets all contents in this location
                    if(qrornfc) {
                        JSONArray contentsJSON = res.getJSONArray("contents");
                        for (int j = 0; j < contentsJSON.length(); ++j) {
                            JSONObject item = contentsJSON.getJSONObject(j);
                            //Transform JSON content to model content
                            JSONObject contentJson = item.getJSONObject("content");
                            content = mapper.readValue(contentJson.toString(), Content.class);
                            //Transform JSON content infomration to model content infomration
                            JSONObject content_information = item.getJSONObject("content_information");
                            itemContentInformation = mapper.readValue(content_information.toString(), ContentInformation.class);
                            //Transform JSON content type to model content type
                            JSONObject content_type = item.getJSONObject("content_type");
                            itemContentType = mapper.readValue(content_type.toString(), ContentType.class);
                            if(ControllerPreferences.getLanguage().compareTo("fr-FR")==0){
                                if(itemContentType.getName()=="Cuadro"){
                                    itemContentType.setName("Cadre");
                                    itemContentType.setDescription("Ce type de contenu accueille toutes les images Musée.");
                                }else if(itemContentType.getName()=="Escultura"){
                                    itemContentType.setName("Sculpture");
                                    itemContentType.setDescription("Ce type de contenu abrite toutes les sculptures du musée.");
                                }else{
                                    itemContentType.setName("Vidéo");
                                    itemContentType.setDescription("Ce type de contenu comme des vidéos maison et multimédia.");
                                }

                            }
                            else if(ControllerPreferences.getLanguage().compareTo("en-GB")==0){
                                if(itemContentType.getName()=="Cuadro"){
                                    itemContentType.setName("Picture");
                                    itemContentType.setDescription("This type of content houses all the pictures of the museum.");
                                }else if(itemContentType.getName()=="Escultura"){
                                    itemContentType.setName("Sculpture");
                                    itemContentType.setDescription("This type of content houses all the sculptures of the museum.");
                                }else{
                                    itemContentType.setName("Video");
                                    itemContentType.setDescription("This type of content houses all the videos of the museum.");
                                }
                            }
                            //Add videos to content
                            if (item.has("videos")) {
                                JSONArray videosJson = item.getJSONArray("videos");
                                for (int i = 0; i < videosJson.length(); ++i) {
                                    JSONObject videoJson = videosJson.getJSONObject(i);
                                    if(videoJson.has("video")) {
                                        JSONObject videoJ = videoJson.getJSONObject("video");
                                        Multimedia video = mapper.readValue(videoJ.toString(), Multimedia.class);
                                        video.setType("video");
                                        content.addMultimedia(video);
                                    }
                                }
                            }
                            //Add images to content
                            if (item.has("images")) {
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
                            //add content information and content type to content
                            content.setContentInformation(itemContentInformation);
                            content.setContentType(itemContentType);
                            //add content to location
                            location.addContent(content);
                        }
                    }else { //Show one content

                        JSONObject contentJson = res.getJSONObject("content");
                        content = mapper.readValue(contentJson.toString(), Content.class);
                        //Transform JSON content infomration to model content infomration
                        JSONObject content_information = res.getJSONObject("content_information");
                        itemContentInformation = mapper.readValue(content_information.toString(), ContentInformation.class);
                        //Transform JSON content type to model content type
                        JSONObject content_type = res.getJSONObject("content_type");
                        itemContentType = mapper.readValue(content_type.toString(), ContentType.class);
                        //Add videos to content
                        if (res.has("videos")) {
                            JSONArray videosJson = res.getJSONArray("videos");
                            for (int i = 0; i < videosJson.length(); ++i) {
                                JSONObject videoJson = videosJson.getJSONObject(i);
                                if(videoJson.has("video")) {
                                    JSONObject videoJ = videoJson.getJSONObject("video");
                                    Multimedia video = mapper.readValue(videoJ.toString(), Multimedia.class);
                                    video.setType("video");
                                    content.addMultimedia(video);
                                }
                            }
                        }
                        //Add images to content
                        if (res.has("images")) {
                            JSONArray imagesJson = res.getJSONArray("images");
                            for (int i = 0; i < imagesJson.length(); ++i) {
                                JSONObject imageJson = imagesJson.getJSONObject(i);
                                JSONObject imgJson = imageJson.getJSONObject("image");
                                Multimedia image = mapper.readValue(imgJson.toString(), Multimedia.class);
                                image.setType("image");
                                image.setAlternativeText(imageJson.getString("alt_text"));
                                content.addMultimedia(image);
                            }
                        }
                        //add content information and content type to content
                        content.setContentInformation(itemContentInformation);
                        content.setContentType(itemContentType);
                        //add content to location
                        location.addContent(content);
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
                    R.string.conection_Problems,
                    Toast.LENGTH_SHORT);
            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 0);
            toast.show();
        }else
        {
            //Initialize all view in display
            final ImageView imageView = (ImageView) ((Activity)context).findViewById(R.id.imgArtwork);
            TextView typeArtWork = (TextView)  ((Activity)context).findViewById(R.id.typeArtWork);
            TextView titleArtwork = (TextView)  ((Activity)context).findViewById(R.id.titleArtwork);
            TextView descriptionArtwork = (TextView)  ((Activity)context).findViewById(R.id.descriptionArtwork);
            TextView dateArtwork = (TextView)  ((Activity)context).findViewById(R.id.dateArtwork);
            TextView locationArtwork = (TextView)  ((Activity)context).findViewById(R.id.locationArtwork);
            final SimpleExoPlayerView videoView = (SimpleExoPlayerView)((Activity) context).findViewById(R.id.videoArtwork);

            //If content is scan by nfc or qr gets all contents in this location
            if(qrornfc)
                content = location.getContents().get(index);

            //set values at textview
            if(content.getContentType()!=null) {
                if(ControllerPreferences.getLanguage().compareTo("fr-FR")==0){
                    if(content.getContentType().getName().compareTo("Cuadro")==0){
                        typeArtWork.setText("Cadre");
                        descriptionArtwork.setText("Ce type de contenu accueille toutes les images Musée.");
                    }else if(content.getContentType().getName().compareTo("Escultura")==0){
                        typeArtWork.setText("Sculpture");
                        descriptionArtwork.setText("Ce type de contenu abrite toutes les sculptures du musée.");
                    }else if(content.getContentType().getName().compareTo("Video")==0){
                        typeArtWork.setText("Vidéo");
                        descriptionArtwork.setText("Ce type de contenu comme des vidéos maison et multimédia.");
                    }

                }
                else if(ControllerPreferences.getLanguage().compareTo("en-GB")==0){
                    if(content.getContentType().getName().compareTo("Cuadro")==0){
                        typeArtWork.setText("Picture");
                        descriptionArtwork.setText("This type of content houses all the pictures of the museum.");
                    }else if(content.getContentType().getName().compareTo("Escultura")==0){
                        typeArtWork.setText("Sculpture");
                        descriptionArtwork.setText("This type of content houses all the sculptures of the museum.");
                    }else if(content.getContentType().getName().compareTo("Video")==0){
                        typeArtWork.setText("Video");
                        descriptionArtwork.setText("This type of content houses all the videos of the museum.");
                    }
                }else{
                    typeArtWork.setText(content.getContentType().getName());
                }

                //typeArtWork.setText(content.getContentType().getName());
                artworkName = content.getContentType().getName();
                //mySlide.inicializateToolbar(R.menu.menu_main, typeArtWork.getText().toString() );
            }
            if(content.getContentInformation()!=null) {
                titleArtwork.setText(content.getContentInformation().getName());
                mySlide.inicializateToolbar(R.menu.menu_main, content.getContentInformation().getName().toString() );
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/mm/yyyy",Locale.getDefault());
                if(content.getCreation_date()!=null)
                    dateArtwork.setText(context.getString(R.string.fecha_creacion_obra)+ dateFormat.format(content.getCreation_date()));
                descriptionArtwork.setText(content.getContentInformation().getDescription());
            }
            if(location!=null){
                if(location.getDescription()!=null)
                locationArtwork.setText(context.getString(R.string.location_artwork) + location.getDescription());
            }
            //titleImage.setText(artworkName);

            //position scroll to top
            ((ScrollView) ((Activity)context).findViewById(R.id.scrollView)).post(new Runnable()
            {
                public void run() {
                    ((ScrollView) ((Activity)context).findViewById(R.id.scrollView)).fullScroll(ScrollView.FOCUS_UP);
                }
            });

            final ArrayList<Multimedia> imageMultimedia = content.getMultimediaByType("image");
            //Set image in imageview and description
            if(imageMultimedia!=null)
            if(imageMultimedia.size()>0) {
                Picasso.with(context).load(QueryBBDD.server + imageMultimedia.get(0).getUrl()).into(imageView);
                imageView.setContentDescription(imageMultimedia.get(0).getAlternativeText());
                //If arrays only contains one image hide carrousel control else add listener to carrousel
                if (imageMultimedia.size() == 1) {
                    //RelativeLayout relativeLayout = (RelativeLayout) ((Activity) context).findViewById(R.id.carrousel_images);
                    Button btn1 = (Button) ((Activity) context).findViewById(R.id.btPreviousImage);
                    Button btn2 = (Button) ((Activity) context).findViewById(R.id.btNextImage);

                    btn1.setVisibility(View.GONE);
                    btn2.setVisibility(View.GONE);
                    //relativeLayout.setVisibility(View.GONE);
                } else {
                    Button previosImage = (Button) ((Activity) context).findViewById(R.id.btPreviousImage);
                    Button nextImage = (Button) ((Activity) context).findViewById(R.id.btNextImage);
                    previosImage.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            indexImage--;
                            if (indexImage < 0) {
                                indexImage = imageMultimedia.size()-1;
                            }
                            Picasso.with(context).load(QueryBBDD.server+imageMultimedia.get(indexImage).getUrl()).into(imageView);
                            imageView.setContentDescription(imageMultimedia.get(indexImage).getAlternativeText());
                        }
                    });
                    nextImage.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            indexImage++;
                            if (indexImage >= imageMultimedia.size()) {
                                indexImage = 0;
                            }
                            Picasso.with(context).load(QueryBBDD.server+imageMultimedia.get(indexImage).getUrl()).into(imageView);
                            imageView.setContentDescription(imageMultimedia.get(indexImage).getAlternativeText());
                        }
                    });
                }
            }else {
                imageView.setVisibility(View.GONE);
                //((Activity)context).findViewById(R.id.carrousel_images).setVisibility(View.GONE);
                ((Activity)context).findViewById(R.id.btNextImage).setVisibility(View.GONE);
                ((Activity)context).findViewById(R.id.btPreviousImage).setVisibility(View.GONE);
            }

            final ArrayList<Multimedia> videoMultimedia = content.getMultimediaByType("video");
            //If array contains video put video and subtitles in videoview else hide videoview
            if(videoMultimedia!=null)
                if(videoMultimedia.size()==1){
                    Button btn1 = (Button) ((Activity) context).findViewById(R.id.btNextVideo);
                    Button btn2 = (Button) ((Activity) context).findViewById(R.id.btPreviousVideo);

                    btn1.setVisibility(View.GONE);
                    btn2.setVisibility(View.GONE);
                    indexVideo=0;
                    /*if(ControllerPreferences.getDisability()!=2) {
                        if (videoMultimedia.get(indexVideo).getId_lang() != null) {
                            changeVideo(videoMultimedia, videoView);
                        }
                    }else*/
                        changeVideo(videoMultimedia, videoView);

                }else if(videoMultimedia.size()>0){
                    Button previousVideo = (Button) ((Activity) context).findViewById(R.id.btPreviousVideo);
                    Button nextVideo = (Button) ((Activity) context).findViewById(R.id.btNextVideo);
                    previousVideo.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            indexVideo--;
                            if (indexVideo < 0) {
                                indexVideo = videoMultimedia.size()-1;
                            }
                           /* if(ControllerPreferences.getDisability()!=2) {
                                if (videoMultimedia.get(indexVideo).getId_lang() != null) {
                                    changeVideo(videoMultimedia, videoView);
                                }
                            }else*/
                                changeVideo(videoMultimedia, videoView);
                        }
                    });
                    nextVideo.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            indexVideo++;
                            if (indexVideo >= videoMultimedia.size()) {
                                indexVideo = 0;
                            }
                            /*if(ControllerPreferences.getDisability()!=2) {
                                if (videoMultimedia.get(indexVideo).getId_lang() != null) {
                                    changeVideo(videoMultimedia, videoView);
                                }
                            }else*/
                                changeVideo(videoMultimedia, videoView);
                        }
                    });
                   /* if(ControllerPreferences.getDisability()!=2) {
                        if (videoMultimedia.get(indexVideo).getId_lang() != null) {
                            changeVideo(videoMultimedia, videoView);
                        }
                    }else*/
                        changeVideo(videoMultimedia, videoView);

               /* videoView.setVideoURI(uri);

                MediaController mediaController = new MediaController(context);
                mediaController.setAnchorView(videoView);
                videoView.setMediaController(mediaController);
                String subtitles=QueryBBDD.server+videoMultimedia.get(0).getSubtitle();
                if(subtitles!=null && subtitles.compareTo("")!=0 && subtitles.endsWith(".vtt")) {
                    HSubtitles hSubtitles = new HSubtitles(context,videoView,subtitles);
                    hSubtitles.execute();
                }*/
            }else
            {
                videoView.setVisibility(View.GONE);
                ((Activity)context).findViewById(R.id.btNextVideo).setVisibility(View.GONE);
                ((Activity)context).findViewById(R.id.btPreviousVideo).setVisibility(View.GONE);
            }
        }
        pDialog.dismiss();
    }
    // Method to change video
    private void changeVideo(ArrayList<Multimedia> videoMultimedia,SimpleExoPlayerView videoView){

                if (videoMultimedia.get(indexVideo).getAlternativeText() != null)
                    videoView.setContentDescription(videoMultimedia.get(indexVideo).getAlternativeText());
                Uri uri = Uri.parse(QueryBBDD.server + videoMultimedia.get(indexVideo).getUrl());
                videoView.setPlayer(player);
                // Produces DataSource instances through which media data is loaded.
                DataSource.Factory dataSourceFactory = new DefaultDataSourceFactory(context, Util.getUserAgent(context, "Museums4EveryOne"));
                // Produces Extractor instances for parsing the media data.
                ExtractorsFactory extractorsFactory = new DefaultExtractorsFactory();
                // This is the MediaSource representing the media to be played.
                MediaSource videoSource = new ExtractorMediaSource(uri,
                        dataSourceFactory, extractorsFactory, null, null);
                // If has subtitles load video with subtitles
                if (videoMultimedia.get(indexVideo).getSubtitle() != null && videoMultimedia.get(indexVideo).getSubtitle().compareTo("") != 0) {
                    Uri subtitleUri = Uri.parse(QueryBBDD.server + videoMultimedia.get(indexVideo).getSubtitle());

                    Format textFormat = Format.createTextSampleFormat(null, MimeTypes.TEXT_VTT,
                            null, Format.NO_VALUE, Format.NO_VALUE, ControllerPreferences.getLanguage(), null);
                    MediaSource subtitleSource = new SingleSampleMediaSource(subtitleUri, dataSourceFactory, textFormat, C.TIME_UNSET);
                    // Plays the video with the sideloaded subtitle.
                    MergingMediaSource mergedSource =
                            new MergingMediaSource(videoSource, subtitleSource);
                    // Prepare the player with the source.
                    player.prepare(mergedSource);
                } else // if hasn't subtitles only video
                    player.prepare(videoSource);
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
