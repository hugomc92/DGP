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

import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;


/**
 * Created by Emilio Chica Jimenez on 27/10/2015.
 */
public class HQueryContentType extends AsyncTask<Void, Integer, String> {

        Context context;
        String resultado;
        ProgressDialog pDialog;
        List<ContentType> contentTypeList;


        public HQueryContentType(Context c , List<ContentType> contentTypeList) {
            context=c;
            this.contentTypeList = contentTypeList;
        }

        @Override
        protected String doInBackground(Void... params) {
            ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            resultado = QueryBBDD.realizarConsulta(QueryBBDD.consultaType, "", "POST");
            JSONObject res =null;
            ContentType itemContentType =null;
            try {
                if(resultado!=null) {
                    res = new JSONObject(resultado);
                    if (!res.isNull("ContentType")) {
                        JSONArray contentType = res.getJSONArray("ContentType");

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

