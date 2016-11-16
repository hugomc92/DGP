package es.ugr.redforest.museumsforeveryone.threads;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.view.Gravity;
import android.widget.Toast;



import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;






/**
 * Created by Emilio Chica Jimenez on 27/10/2015.
 */
public class HQueryMarkers extends AsyncTask<Void, Integer, JSONObject> {

        Context context;
        String resultado;
        ProgressDialog pDialog;
      //  List<MarkerAlergia> markersAlergia;


        public HQueryMarkers(Context c /*, List<MarkerAlergia> markersAlergia*/) {
            context=c;
           // this.markersAlergia = markersAlergia;
        }

        @Override
        protected JSONObject doInBackground(Void... params) {
            ObjectMapper mapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
 //           resultado = ConsultaBBDD.realizarConsulta(ConsultaBBDD.consultaMarkers, "", "POST");
            JSONObject res =null;
            try {
                if(resultado!=null) {
                    res = new JSONObject(resultado);
                    ///GUARDAR Inventario EN SQLITE
                    if (!res.isNull("markers")) {
                        JSONArray markers = res.getJSONArray("markers");

                        for (int j = 0; j < markers.length(); ++j) {
                            JSONObject item = markers.getJSONObject(j);

                            ma
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

