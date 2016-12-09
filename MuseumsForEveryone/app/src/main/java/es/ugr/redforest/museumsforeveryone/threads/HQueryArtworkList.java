package es.ugr.redforest.museumsforeveryone.threads;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.view.Gravity;
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

import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
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
    String typeContent="";


    public HQueryArtworkList(Context c , ArrayList<ContentInformation> contentInformationList, String typeContent) {
        this.context=c;
        this.contentInformationList = contentInformationList;
        this.typeContent = typeContent;

    }

    @Override
    protected String doInBackground(Void... params) {
        ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        result = QueryBBDD.doQuery(QueryBBDD.queryContentInformationOfType+"/"+typeContent+"/lang/"+ ControllerPreferences.getLanguage(), "", "POST");
        JSONObject res =null;
        ContentInformation contentInformation =null;
        try {
            if(result !=null) {
                res = new JSONObject(result);
                if (!res.isNull("contents")) {
                    JSONArray contentType = res.getJSONArray("contents");

                    for (int j = 0; j < contentType.length(); ++j) {
                        JSONObject item = contentType.getJSONObject(j);
                        JSONObject itemContentInformation = item.getJSONObject("content_information");
                        contentInformation = mapper.readValue(itemContentInformation.toString(), ContentInformation.class);
                        contentInformationList.add(contentInformation);
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

        if (resultado==null && resultado.compareTo("")==0) {
            Toast toast = Toast.makeText(context,
                    "Problemas con internet",
                    Toast.LENGTH_SHORT);
            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 0);
            toast.show();
            pDialog.dismiss();
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
