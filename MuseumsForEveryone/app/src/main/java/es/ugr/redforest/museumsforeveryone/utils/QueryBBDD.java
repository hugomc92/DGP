package es.ugr.redforest.museumsforeveryone.utils;
import android.os.Build;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;


/**
 * Created by Emilio Chica Jimenez on 27/10/2015.
 */
public class QueryBBDD {


    public static String server ="http://hugomaldonado.ddns.net:2424/";



    public static final String queryType = "/api/content_type";
    public static final String queryContentInformationOfType ="/api/content/type";
    public static final String queryContent ="/api/content/";
    public static final String queryContentOfLocalization ="/api/content/localization";

    public static String doQuery(String urlREST, String parameters, String metodo) {

            HttpURLConnection connection= null;

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.FROYO) {

                System.setProperty("http.keepAlive", "false");
            }

            try {

                URL url = new URL(server + urlREST );

                connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(10000);
                connection.setRequestMethod(metodo);
                connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                connection.setDoInput(true);
                connection.setDoOutput(true);
                OutputStream os = connection.getOutputStream();
                os.write(parameters.getBytes());
                os.flush();
                connection.connect();

                int responseCode = connection.getResponseCode();

                Log.d(" reponseCode", String.valueOf(responseCode));

                if(responseCode == HttpURLConnection.HTTP_OK){

                    StringBuilder sb = new StringBuilder();
                    try{

                        BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                        String linea;

                        while ((linea = br.readLine())!= null){

                            sb.append(linea);
                        }

                        return sb.toString();
                    }catch (Exception e){

                        e.printStackTrace();
                    }

                }else{

                    if(responseCode == HttpURLConnection.HTTP_CLIENT_TIMEOUT){
                        Log.d(" reponseCode",  connection.getErrorStream().toString());
                    }
                }

            } catch (MalformedURLException e) {

                e.printStackTrace();
            }catch (IOException e){
                e.printStackTrace();
            }
            finally {
                    if(connection!=null)
                        connection.disconnect();
            }

            return null;
    }

}
