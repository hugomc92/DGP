package es.ugr.redforest.museumsforeveryone.screens;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.nfc.NfcAdapter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;
import android.widget.Toast;

import com.dlazaro66.qrcodereaderview.QRCodeReaderView;

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Created by mrsas on 07/12/2016.
 */

public class ActivityRequestCameraPermission extends Activity {

    private static final int CAMERA_REQUEST = 1;
    private static final int NFC_REQUEST = 2;
    private NfcAdapter mNfcAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.);
        mNfcAdapter = NfcAdapter.getDefaultAdapter(this);

        Bundle extra = getIntent().getExtras();

        if(extra == null){
            if (mNfcAdapter == null) {
                // If the device hasn't got NFC we'll use QR and will request for camera permission
                if(ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA)== PackageManager.PERMISSION_GRANTED){
                    Intent mainIntent = new Intent(this, ActivityQRScanner.class);
                    startActivity(mainIntent);
                    finish();

                    Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();
                }else{
                    //explainPermisUse(actualActivity,recyclerView.getContext());
                    requestCameraPermit();
                }
            }else{
                //If the device has got NFC:
                if(ActivityCompat.checkSelfPermission(this, Manifest.permission.NFC)== PackageManager.PERMISSION_GRANTED){
                    Intent mainIntent = new Intent(this, ActivityNFCScanner.class);
                    startActivity(mainIntent);
                    finish();

                    Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();
                }else{
                    //explainPermisUse(actualActivity,recyclerView.getContext());
                    requestCameraPermit();
                }

            }
        }else{
            if(ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA)== PackageManager.PERMISSION_GRANTED){
                Intent mainIntent = new Intent(this, ActivityQRScanner.class);
                startActivity(mainIntent);
                finish();

                Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();
            }else{
                //explainPermisUse(actualActivity,recyclerView.getContext());
                requestCameraPermit();
            }
        }






    }

    private void requestCameraPermit(){
        ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.CAMERA},CAMERA_REQUEST);
        // Toast.makeText(context,context.getString(R.string.Permits),Toast.LENGTH_SHORT).show();

    }
    private void requestNFCPermit(){
        ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.NFC},NFC_REQUEST);
        // Toast.makeText(context,context.getString(R.string.Permits),Toast.LENGTH_SHORT).show();

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        Toast.makeText(this,getString(R.string.Permits),Toast.LENGTH_SHORT).show();

        if(requestCode == CAMERA_REQUEST)
        {
            if(grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                Intent mainIntent = new Intent(this, ActivityQRScanner.class);
                startActivity(mainIntent);
                finish();
                Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();


            }
        }else if(requestCode == NFC_REQUEST)
        {
            if(grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                Intent mainIntent = new Intent(this, ActivityNFCScanner.class);
                startActivity(mainIntent);
                finish();
                Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();


            }
        }
    }

}
