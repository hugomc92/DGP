package es.ugr.redforest.museumsforeveryone.screens;

import android.content.Intent;
import android.graphics.PointF;
import android.os.Bundle;
import android.os.Vibrator;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import android.nfc.NfcAdapter;

import com.dlazaro66.qrcodereaderview.QRCodeReaderView;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

public class ActivityNFCScanner extends AppCompatActivity{

    private static final int NFC_REQUEST = 2;
    private TextView resultTextView;
    private NfcAdapter mNfcAdapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nfc_scanner);
        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializarToolbar(R.menu.menu_main,getString(R.string.app_name));

        resultTextView = (TextView) findViewById(R.id.textView_Prueba2);

        mNfcAdapter = NfcAdapter.getDefaultAdapter(this);

        if (!mNfcAdapter.isEnabled()) {
            Toast.makeText(this,getString(R.string.NFC_Error_Disabled),Toast.LENGTH_LONG).show();
        } else {
            Toast.makeText(this,"Tiene NFC",Toast.LENGTH_LONG).show();
        }

        handleIntent(getIntent());

    }
    @Override
    public void onBackPressed() {
        Intent mainIntent = new Intent(this, MainActivity.class);
        mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(mainIntent);

    }

    private void handleIntent(Intent intent) {
        // TODO: handle Intent
    }

    public void onCliclActiveQR(View v){
        Intent activeQRIntent = new Intent(ActivityNFCScanner.this, ActivityRequestCameraPermission.class);
        activeQRIntent.putExtra("QR","active");
        startActivity(activeQRIntent);
    }


/*
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


    }*/


}
