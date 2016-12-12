package es.ugr.redforest.museumsforeveryone.screens;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.nfc.NfcAdapter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
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

        //The extra stuff is just because of the onclick method in the nfc scanner xml
        if(extra == null){
            // check if the device has NFC sensor
            if (mNfcAdapter == null) {
                // If the device hasn't got NFC we'll use QR and will request for camera permission
                if(ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA)== PackageManager.PERMISSION_GRANTED){
                    Intent mainIntent = new Intent(this, ActivityQRScanner.class);
                    startActivity(mainIntent);
                    finish();

                    //Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();
                }else{
                    explainPermisUse();

                }
            }else{
                //If the device has got NFC:
                if(ActivityCompat.checkSelfPermission(this, Manifest.permission.NFC)== PackageManager.PERMISSION_GRANTED){
                    Intent mainIntent = new Intent(this, ActivityNFCScanner.class);
                    startActivity(mainIntent);
                    finish();

                    //Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();
                }else{
                    explainPermisUse();
                }

            }
        }else{
            //This code exectutes only when the QR read button is pressed in ActivityNFCScanner layout
            if(ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA)== PackageManager.PERMISSION_GRANTED){
                Intent mainIntent = new Intent(this, ActivityQRScanner.class);
                startActivity(mainIntent);
                finish();

            }else{
                explainPermisUse();
            }
        }






    }

    //Method that explain the reason for accepting the camera permission
    private void explainPermisUse() {
        if(ActivityCompat.shouldShowRequestPermissionRationale(this,Manifest.permission.CAMERA)){
            //Toast.makeText(this, this.getString(R.string.Camera_Permit),Toast.LENGTH_SHORT).show();
            alertBasicDialog();
        }
    }
    //Method that explain the reason for accepting the NFC permission
    private void explainNFCPermisUse() {
        if(ActivityCompat.shouldShowRequestPermissionRationale(this,Manifest.permission.NFC)){
            //Toast.makeText(this, this.getString(R.string.Camera_Permit),Toast.LENGTH_SHORT).show();
            alertBasicDialogNFC();
        }
    }

    //Method that create the message dialog for showing the permission reason.
    private void alertBasicDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setMessage(this.getString(R.string.Camera_Permit));

        builder.setPositiveButton(this.getString(R.string.continue_button), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                requestCameraPermit();

            }
        });

        builder.show();
    }
    //Method that create the message dialog for showing the permission reason.
    private void alertBasicDialogNFC() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setMessage(this.getString(R.string.NFC_Permit));

        builder.setPositiveButton(this.getString(R.string.continue_button), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                requestNFCPermit();

            }
        });

        builder.show();
    }

    //Method that create a dialog that is showed only when the user denied the requestPermission and it is used for confirm the user action.
    //If the user press no the dialog shows if he really want to denied it and why he need it, and then close the dialog. If the user press yes the requestPermission is called again.
    private void alertBasicDialogDeniedPermission() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setMessage(this.getString(R.string.Permit_Reason_Ask_Again));

        builder.setPositiveButton(this.getString(R.string.yes), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                requestCameraPermit();

            }
        });
        builder.setNegativeButton(this.getString(R.string.No), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                onBackPressed();

            }
        });

        builder.show();
    }


    //Method that create a dialog that is showed only when the user denied the requestPermission and it is used for confirm the user action.
    //If the user press no the dialog shows if he really want to denied it and why he need it, and then close the dialog. If the user press yes the requestPermission is called again.
    private void alertBasicDialogDeniedNFCPermission() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setMessage(this.getString(R.string.NFC_Reason_Ask_again));

        builder.setPositiveButton(this.getString(R.string.yes), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                requestNFCPermit();

            }
        });
        builder.setNegativeButton(this.getString(R.string.No), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                onBackPressed();

            }
        });

        builder.show();
    }


    //Method used just for calling the RequestPermissions specifically.
    private void requestCameraPermit(){
        ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.CAMERA},CAMERA_REQUEST);
        // Toast.makeText(context,context.getString(R.string.Permits),Toast.LENGTH_SHORT).show();

    }
    //Method used just for calling the RequestPermissions specifically.
    private void requestNFCPermit(){
        ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.NFC},NFC_REQUEST);
        // Toast.makeText(context,context.getString(R.string.Permits),Toast.LENGTH_SHORT).show();

    }

    //This is the request handler, called always when requestPermissions is invoked.
    //If the requestPermissions is called because of the camera or NFC sensor the Android handler will answer with this response.
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        //Toast.makeText(this,getString(R.string.Permits),Toast.LENGTH_SHORT).show();

        if(requestCode == CAMERA_REQUEST)
        {
            if(grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                Intent mainIntent = new Intent(this, ActivityQRScanner.class);
                startActivity(mainIntent);
                finish();
                //Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();


            }else{
                /*
                Intent mainIntent = new Intent(this, Act.class);
                mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(mainIntent);
                finish();*/
                alertBasicDialogDeniedPermission();
                //Toast.makeText(this,getString(R.string.Permit_Reason),Toast.LENGTH_LONG).show();
            }
        }else if(requestCode == NFC_REQUEST)
        {
            if(grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                Intent mainIntent = new Intent(this, ActivityNFCScanner.class);
                startActivity(mainIntent);
                finish();
                //Toast.makeText(this,getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();


            }else{
                alertBasicDialogDeniedNFCPermission();
                //Toast.makeText(this,getString(R.string.Permit_Reason),Toast.LENGTH_LONG).show();
            }
        }
    }

}
