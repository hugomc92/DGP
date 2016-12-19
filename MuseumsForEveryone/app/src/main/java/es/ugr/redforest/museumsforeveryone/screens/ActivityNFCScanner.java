package es.ugr.redforest.museumsforeveryone.screens;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.Tag;
import android.nfc.tech.NdefFormatable;
import android.os.Bundle;
import android.os.Parcelable;
import android.os.Vibrator;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import android.nfc.NfcAdapter;

import java.io.UnsupportedEncodingException;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.SliderMenu;

public class ActivityNFCScanner extends ActionBarActivity {

    private static final int NFC_REQUEST = 2;
    private TextView resultTextView;
    private NfcAdapter nfcAdapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nfc_scanner);
        SliderMenu mySlide = new SliderMenu(this,this);
        mySlide.inicializarToolbar(R.menu.menu_main,getString(R.string.app_name));

        resultTextView = (TextView) findViewById(R.id.textView_Prueba2);

        nfcAdapter = NfcAdapter.getDefaultAdapter(this);

        if (!nfcAdapter.isEnabled()) {
            Toast.makeText(this,getString(R.string.NFC_Error_Disabled),Toast.LENGTH_LONG).show();
        }

        handleIntent(getIntent());

    }

    @Override
    protected void onResume() {
        super.onResume();

        enableForegroundDispatchSystem();
    }

    @Override
    protected void onPause() {
        super.onPause();

        disableForegroundDispatchSystem();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);


        if (intent.hasExtra(NfcAdapter.EXTRA_TAG)) {

            Parcelable[] parcelables = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);

            if(parcelables != null && parcelables.length > 0)
            {
                readTextFromMessage((NdefMessage) parcelables[0]);
            }else{
                Toast.makeText(this, R.string.error_reading_NFC, Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void readTextFromMessage(NdefMessage ndefMessage) {

        NdefRecord[] ndefRecords = ndefMessage.getRecords();

        if(ndefRecords != null && ndefRecords.length>0){

            NdefRecord ndefRecord = ndefRecords[0];

            String tagContent = getTextFromNdefRecord(ndefRecord);

            try {
                int id_result = Integer.parseInt(tagContent);
                Intent mainIntent = new Intent(this, ActivityArtworkDisplay.class);
                mainIntent.putExtra("qrornfc",tagContent);
                startActivity(mainIntent);

            }catch (Exception e){

                Vibrator v = (Vibrator) this.getSystemService(this.VIBRATOR_SERVICE);

                v.vibrate(200);
                Toast.makeText(this, R.string.invalid_NFC_code,Toast.LENGTH_LONG).show();

            }
        }else
        {
            Toast.makeText(this, R.string.NFC_code_not_found, Toast.LENGTH_SHORT).show();
        }

    }

    private void enableForegroundDispatchSystem() {

        Intent intent = new Intent(this, ActivityNFCScanner.class).addFlags(Intent.FLAG_RECEIVER_REPLACE_PENDING);

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);

        IntentFilter[] intentFilters = new IntentFilter[]{};

        nfcAdapter.enableForegroundDispatch(this, pendingIntent, intentFilters, null);
    }

    private void disableForegroundDispatchSystem() {
        nfcAdapter.disableForegroundDispatch(this);
    }

    public String getTextFromNdefRecord(NdefRecord ndefRecord)
    {
        String tagContent = null;
        try {
            byte[] payload = ndefRecord.getPayload();
            String textEncoding = ((payload[0] & 128) == 0) ? "UTF-8" : "UTF-16";
            int languageSize = payload[0] & 0063;
            tagContent = new String(payload, languageSize + 1,
                    payload.length - languageSize - 1, textEncoding);
        } catch (UnsupportedEncodingException e) {
            Log.e("getTextFromNdefRecord", e.getMessage(), e);
        }
        return tagContent;
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


}
