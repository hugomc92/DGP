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
import java.util.List;

import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;

/**
 * Thread to connect to the server and get the content information
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 */

public class HQueryContentInformation extends AsyncTask<Void, Integer, String> {
    Context context;
    String resultado;
    ProgressDialog pDialog;
    List<ContentInformation> contentInformationList;


    public HQueryContentInformation(Context c , List<ContentInformation> contentInformationList) {
        context=c;
        this.contentInformationList = contentInformationList;
    }

    @Override
    protected String doInBackground(Void... params) {
        ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        resultado = QueryBBDD.realizarConsulta(QueryBBDD.consultaContentInformation, "", "POST");
        JSONObject res =null;
        ContentInformation itemContentInformation =null;
        try {
            if(resultado!=null) {
                res = new JSONObject(resultado);
                if (!res.isNull("ContentInformation")) {
                    JSONArray contentType = res.getJSONArray("ContentInformation");

                    for (int j = 0; j < contentType.length(); ++j) {
                        JSONObject item = contentType.getJSONObject(j);
                        itemContentInformation = mapper.readValue(item.toString(), ContentInformation.class);
                        contentInformationList.add(itemContentInformation);
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
        pDialog.setMessage("Cargando Datos");
        pDialog.setCancelable(false);
        pDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        pDialog.show();
    }



    @Override
    protected void onCancelled() {

    }
}
