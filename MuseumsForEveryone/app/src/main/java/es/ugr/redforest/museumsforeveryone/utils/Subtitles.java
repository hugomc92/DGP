package es.ugr.redforest.museumsforeveryone.utils;

import android.content.Context;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Scanner;

/**
 * Created by Emilio Chica Jiménez on 22/12/2016.
 */

public class Subtitles {
    public static InputStream getSubtitleSource(String filepath, Context context) {
        InputStream ins = null;
        URL url = null;
        try {
            url = new URL(filepath);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        try {
            ins = url.openStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
       // Scanner s = new Scanner(ins, "UTF-8").useDelimiter("\\A");
       // String result = s.hasNext() ? s.next() : "";
       // Log.d("resultado",result);
       /* File file = new File(context.getFilesDir(), ccFileName);

        FileInputStream fins = null;
        try {
            fins = new FileInputStream(file);
        } catch (Exception e) {
            Log.e("SUBTITLES", "exception " + e);
        }
        ins = (InputStream) fins;*/
        return ins;
    }
}
/*URL url = null;
        try {
            url = new URL(filepath);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        URLConnection uconn = null;
        try {
            uconn = url.openConnection();
            uconn.setReadTimeout(5000);
            uconn.setConnectTimeout(5000);
            ins = uconn.getInputStream();
            BufferedInputStream bufferinstream = new BufferedInputStream(is);

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            //We create an array of bytes
            byte[] data = new byte[60000];
            int current = 0;

            while((current = bufferinstream.read(data,0,data.length)) != -1){
                buffer.write(data,0,current);
            }

            FileOutputStream fos = new FileOutputStream(file);
            fos.write(buffer.toByteArray());
            fos.flush();
            fos.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }*/