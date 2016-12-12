package es.ugr.redforest.museumsforeveryone.utils;


import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.location.Location;
import android.support.v4.view.MenuItemCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.view.GestureDetector;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Toast;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.adapters.AdapterMenuLateral;
import es.ugr.redforest.museumsforeveryone.screens.ActivityArtworkList;
import es.ugr.redforest.museumsforeveryone.screens.ActivityContactInform;
import es.ugr.redforest.museumsforeveryone.screens.ActivityGuidedVisit;
import es.ugr.redforest.museumsforeveryone.screens.ActivityPreferences;
import es.ugr.redforest.museumsforeveryone.screens.ActivityQRScanner;
import es.ugr.redforest.museumsforeveryone.screens.ActivityRequestCameraPermission;
import es.ugr.redforest.museumsforeveryone.screens.MainActivity;

/**
 * Created by sasu on 06/12/16.
 */

public class SliderMenu extends AppCompatActivity{
    public Toolbar toolbar;
    String TITLES[];
    int ICONS[]={R.drawable.ic_home_black_48dp,R.drawable.qr_code_variant,R.drawable.ic_list_black_24dp,R.drawable.ic_assistant_photo_black_24dp, R.drawable.ic_settings_black_24dp, R.drawable.ic_help_black_24dp};
    RecyclerView mRecyclerView;							  // Declaring RecyclerView
    RecyclerView.Adapter mAdapter;                        // Declaring Adapter For Recycler View
    RecyclerView.LayoutManager mLayoutManager;            // Declaring Layout Manager as a linear layout manager
    public DrawerLayout Drawer;                                  // Declaring DrawerLayout
    public ActionBarDrawerToggle mDrawerToggle;
    Context context;
    Activity actualActivity;
    private static final int CAMERA_REQUEST = 1;

    public SliderMenu(Context context,Activity v){
        this.context = context;
        this.TITLES = new String[]{context.getString(R.string.home),context.getString(R.string.artwork_scann),context.getString(R.string.artwork_list),context.getString(R.string.guided_visit),context.getString(R.string.preferences),context.getString(R.string.contact_info)};
        actualActivity =v;
        toolbar = (Toolbar) v.findViewById(R.id.tool_bar);
        mRecyclerView = (RecyclerView)  v.findViewById(R.id.RecyclerView); // Assigning the RecyclerView Object to the xml View
        mAdapter = new AdapterMenuLateral(TITLES,ICONS);       // Creating the Adapter of AdapterMenuLateral class(which we are going to see in a bit)
        Drawer = (DrawerLayout) v.findViewById(R.id.DrawerLayout);        // Drawer object Assigned to the view

    }
    public void inicializarToolbar(int xml,String nombre){

        //////////////////////////////////CODIGASOOO///////////////////////////
        toolbar.inflateMenu(xml);
        toolbar.setTitle(nombre);
        //////////////////////////////////CODIGASOOO///////////////////////////

        mRecyclerView.setHasFixedSize(true);                            // Letting the system know that the list objects are of fixed size


        // And passing the titles,icons,toolbar_header_menu_lateral view name, toolbar_header_menu_lateral view email,
        // and toolbar_header_menu_lateral view profile picture

        mRecyclerView.setAdapter(mAdapter);                              // Setting the adapter to RecyclerView

        final GestureDetector mGestureDetector = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {

            @Override public boolean onSingleTapUp(MotionEvent e) {
                return true;
            }

        });

        mRecyclerView.addOnItemTouchListener(new RecyclerView.OnItemTouchListener() {
            @Override
            public boolean onInterceptTouchEvent(RecyclerView recyclerView, MotionEvent motionEvent) {
                View child = recyclerView.findChildViewUnder(motionEvent.getX(), motionEvent.getY());

                if (child != null && mGestureDetector.onTouchEvent(motionEvent)) {
                    if(recyclerView.getChildAdapterPosition(child)==1) {
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(),MainActivity.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildAdapterPosition(child)==2){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(),ActivityRequestCameraPermission.class);
                        mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildAdapterPosition(child)==3){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), ActivityArtworkList.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildAdapterPosition(child)==4){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), ActivityGuidedVisit.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildAdapterPosition(child)==5){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), ActivityPreferences.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildAdapterPosition(child)==6){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), ActivityContactInform.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }

                    return true;
                }
                return false;
            }

            @Override
            public void onTouchEvent(RecyclerView recyclerView, MotionEvent motionEvent) {

            }

            @Override
            public void onRequestDisallowInterceptTouchEvent(boolean disallowIntercept) {

            }
        });

        mLayoutManager = new LinearLayoutManager(context);                 // Creating a layout Manager

        mRecyclerView.setLayoutManager(mLayoutManager);


        mDrawerToggle = new ActionBarDrawerToggle(actualActivity,Drawer,toolbar,R.string.openDrawer,R.string.closeDrawer){

            @Override
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
            }

            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
            }

            @Override
            public boolean onOptionsItemSelected(MenuItem item) {
                if (item != null && item.getItemId() == android.R.id.home) {
                    if (Drawer.isDrawerOpen(Gravity.LEFT)) {
                        Drawer.closeDrawer(Gravity.LEFT);
                    } else {
                        Drawer.openDrawer(Gravity.LEFT);
                    }
                }
                return false;
            }



        }; // Drawer Toggle Object Made

        Drawer.setDrawerListener(mDrawerToggle); // Drawer Listener set to the Drawer toggle
        mDrawerToggle.syncState();
    }

    private void explainPermisUse(Activity activity,Context context) {
        if(ActivityCompat.shouldShowRequestPermissionRationale(activity,Manifest.permission.CAMERA)){
            Toast.makeText(context,context.getString(R.string.Permit_Reason),Toast.LENGTH_SHORT).show();
            alertBasicDialog(context);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        Toast.makeText(context,context.getString(R.string.Permits),Toast.LENGTH_SHORT).show();

        if(requestCode == CAMERA_REQUEST)
        {
            if(grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                Drawer.closeDrawers();
                Intent mainIntent = new Intent(this.context, ActivityQRScanner.class);
                context.startActivity(mainIntent);
                actualActivity.finish();
                Toast.makeText(this.context,this.context.getString(R.string.Permit_Granted),Toast.LENGTH_SHORT).show();


            }
        }
    }

    private void alertBasicDialog(Context context) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);

        builder.setMessage(context.getString(R.string.Permit_Reason));

        builder.setPositiveButton(context.getString(R.string.continue_button), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

            }
        });

        builder.show();
    }

    public void inicializarToolbar(int xml){
        //inicializarToolbar(xml,"FarmaSearch");
    }
}
