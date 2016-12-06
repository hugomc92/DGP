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

import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.models.Localization;
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
    private String language="";
    private String id="";


    public HQueryContentOfLocalization(Context c , Localization localization, String language, String id) {
        this.context=c;
        this.localization = localization;
        this.language = language;
        this.id = id;

    }

    @Override
    protected String doInBackground(Void... params) {
        String result;
        ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        result = QueryBBDD.doQuery(QueryBBDD.queryContentOfLocalization +"/"+id+"/lang/"+language, "", "POST");
        JSONObject res =null;
        ContentInformation itemContentInformation =null;
        try {
            if(result !=null) {
                res = new JSONObject(result);
                if (!res.isNull("ContentInformation")) {
                    JSONArray contentType = res.getJSONArray("ContentInformation");

                    for (int j = 0; j < contentType.length(); ++j) {
                        JSONObject item = contentType.getJSONObject(j);
                        itemContentInformation = mapper.readValue(item.toString(), ContentInformation.class);
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
