package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.PointF;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;
import android.os.Vibrator;

import com.dlazaro66.qrcodereaderview.QRCodeReaderView;



import es.ugr.redforest.museumsforeveryone.R;

public class ActivityQRScanner extends AppCompatActivity implements QRCodeReaderView.OnQRCodeReadListener{

    private static final int CAMERA_REQUEST = 1;
    private QRCodeReaderView qrCodeReaderView;
    private TextView resultTextView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qrscanner);

        resultTextView = (TextView) findViewById(R.id.textView_Prueba);

        qrCodeReaderView = (QRCodeReaderView) findViewById(R.id.qrdecoderview);
        qrCodeReaderView.setOnQRCodeReadListener(this);

        qrCodeReaderView.setQRDecodingEnabled(true);

        qrCodeReaderView.setAutofocusInterval(2000L);

        qrCodeReaderView.setBackCamera();
    }

    @Override
    protected void onResume() {
        super.onResume();
        qrCodeReaderView.startCamera();
    }

    @Override
    protected void onPause() {
        super.onPause();
        qrCodeReaderView.stopCamera();
    }

    @Override
    public void onBackPressed() {
        Intent mainIntent = new Intent(this, MainActivity.class);
        mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(mainIntent);

    }

    @Override
    public void onQRCodeRead(String text, PointF[] points) {

        try {
            int id_result = Integer.parseInt(text);
            Intent mainIntent = new Intent(this, ActivityArtworkDisplay.class);
            mainIntent.putExtra("id",text);
            startActivity(mainIntent);

        }catch (Exception e){

            Vibrator v = (Vibrator) this.getSystemService(this.VIBRATOR_SERVICE);

            v.vibrate(50);
            Toast.makeText(this,getString(R.string.QR_Error),Toast.LENGTH_LONG).show();

        }


    }
}
