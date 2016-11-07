package com.indalocodex.com.alergiastop.hebras;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.view.Gravity;
import android.widget.Toast;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;


import com.indalocodex.com.alergiastop.basedatos.ConsultaBBDD;
import com.indalocodex.com.alergiastop.model.MarkerAlergia;




/**
 * Created by NeN on 31/10/2015.
 */
public class HConsultaMarkers extends AsyncTask<Void, Integer, JSONObject> {

        Context context;
        String resultado;
        ProgressDialog pDialog;
        List<MarkerAlergia> markersAlergia;


        public HConsultaMarkers(Context c,  List<MarkerAlergia> markersAlergia) {
            context=c;
            this.markersAlergia = markersAlergia;
        }

        @Override
        protected JSONObject doInBackground(Void... params) {
            ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            resultado = ConsultaBBDD.realizarConsulta(ConsultaBBDD.consultaMarkers, "", "POST");
            JSONObject res =null;
            try {
                if(resultado!=null) {
                    res = new JSONObject(resultado);
                    ///GUARDAR Inventario EN SQLITE
                    if (!res.isNull("markers")) {
                        JSONArray markers = res.getJSONArray("markers");

                        for (int j = 0; j < markers.length(); ++j) {
                            JSONObject item = markers.getJSONObject(j);
                            MarkerAlergia markerAlergia = null;
                            try {
                                markerAlergia = mapper.readValue(item.toString(), MarkerAlergia.class);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                            markersAlergia.add(markerAlergia);
                        }
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return res;
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            // durante la ejecucion -- para la barra
        }
    @Override
    protected void onPostExecute(JSONObject resultado) {

        if (resultado==null) {
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

