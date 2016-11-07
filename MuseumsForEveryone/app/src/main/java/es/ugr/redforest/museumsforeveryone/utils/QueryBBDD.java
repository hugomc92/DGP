package com.indalocodex.com.alergiastop.basedatos;

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
public class ConsultaBBDD {


    public static String server ="http://alergiaalpolen.com/";


    //Ficheros para consultas

    public static final String consultaMarkers = "consultaMarkers.php";
    public static final String insertaEstadisticaSintomas = "insertaEstadisticaSintomas.php";
    public static final String insertaEstadisticaCalidad = "insertaEstadisticaCalidad.php";
    public static final String insertaEstadisticaInstrumentos = "insertaEstadisticaInstrumentos.php";
    public static final String insertaEstadisticaAtencion = "insertaEstadisticaAtencion.php";
    public static final String insertaUsuario = "insertaUsuario.php";
    public static final String insertaEstadisticaMedicamentos = "insertaEstadisticaMedicamentos.php";
    public static final String insertaEstadisticaEjercicios = "insertaEstadisticaEjercicios.php";

    public static String realizarConsulta(String urlREST,String parametros,String metodo) {

            HttpURLConnection conexion = null;

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.FROYO) {

                System.setProperty("http.keepAlive", "false");
            }

            try {

                URL url = new URL(server + urlREST );

                conexion = (HttpURLConnection) url.openConnection();
                conexion.setConnectTimeout(5000);
                conexion.setReadTimeout(10000);
                conexion.setRequestMethod(metodo);
                conexion.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conexion.setDoInput(true);
                conexion.setDoOutput(true);
                OutputStream os = conexion.getOutputStream();
                os.write(parametros.getBytes());
                os.flush();
                conexion.connect();

                int responseCode = conexion.getResponseCode();

                Log.d(" reponseCode", String.valueOf(responseCode));

                if(responseCode == HttpURLConnection.HTTP_OK){

                    StringBuilder sb = new StringBuilder();
                    try{

                        BufferedReader br = new BufferedReader(new InputStreamReader(conexion.getInputStream()));
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
                        Log.d(" reponseCode",  conexion.getErrorStream().toString());
                    }
                }

            } catch (MalformedURLException e) {

                e.printStackTrace();
            }catch (IOException e){
                e.printStackTrace();
            }
            finally {
                    if(conexion!=null)
                        conexion.disconnect();
            }

            return null;
    }

}
