package es.ugr.redforest.museumsforeveryone.utils;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
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

import es.ugr.redforest.museumsforeveryone.R;

/**
 * Created by matl1995 on 23/11/16.
 */

public class SliderMenu {
    /*public Toolbar toolbar;
    String TITLES[]={"Museums For Everyone", "Lista Obras","Visita Guiada","Info Obra","Preferencias","Contacto"};
    int ICONS[]={android.R.drawable.ic_dialog_map,android.R.drawable.ic_input_get,android.R.drawable.arrow_down_float,android.R.drawable.ic_dialog_email, android.R.drawable.ic_btn_speak_now, android.R.drawable.ic_delete};
    RecyclerView mRecyclerView;							  // Declaring RecyclerView
    RecyclerView.Adapter mAdapter;                        // Declaring Adapter For Recycler View
    RecyclerView.LayoutManager mLayoutManager;            // Declaring Layout Manager as a linear layout manager
    public DrawerLayout Drawer;                                  // Declaring DrawerLayout
    public ActionBarDrawerToggle mDrawerToggle;
    Context context;
    Activity actualActivity;
    double lat = Double.MAX_VALUE;
    double longi=Double.MAX_VALUE;

    public SliderMenu(Context context,Activity v){
        this.context = context;
        actualActivity =v;
        toolbar = (Toolbar) v.findViewById(R.id.tool_bar);
        mRecyclerView = (RecyclerView)  v.findViewById(R.id.RecyclerView); // Assigning the RecyclerView Object to the xml View
        mAdapter = new AdapterMenuLateral(TITLES,ICONS);       // Creating the Adapter of AdapterMenuLateral class(which we are going to see in a bit)
        Drawer = (DrawerLayout) v.findViewById(R.id.DrawerLayout);        // Drawer object Assigned to the view

    }
    public void inicializarToolbar(int xml,String nombre){

        //////////////////////////////////CODIGASOOO///////////////////////////
        toolbar.inflateMenu(xml);
        toolbar.setLogo(R.mipmap.ic_launcher);
        toolbar.setTitle(nombre);

        toolbar.setOnMenuItemClickListener(
                new Toolbar.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_search:
                                Intent searchActivity = new Intent(context, Busqueda.class);
                                context.startActivity(searchActivity);
                                break;
                            case R.id.action_carrito:
                                Intent intent = new Intent(context, CargaCesta.class);
                                context.startActivity(intent);
                                break;
                        }
                        return true;
                    }
                });
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
                    if(recyclerView.getChildPosition(child)==1) {
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), MainActivity.class);
                        GeoLocalizacion geo;
                        Location localizacion;
                        geo = new GeoLocalizacion(context); ////////////////////LOCALIZACION
                        localizacion = geo.updatePosicion();
                        if(localizacion!=null) {
                            lat = localizacion.getLatitude();
                            longi = localizacion.getLongitude();
                        }
                        mainIntent.putExtra("lat", lat);
                        mainIntent.putExtra("long", longi);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildPosition(child)==2){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), CargaDepartamentos.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildPosition(child)==3){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), CargaReservas.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildPosition(child)==4){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), CargaContacto.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }
                    /*}else if(recyclerView.getChildPosition(child)==3){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), CargaFAQ.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }else if(recyclerView.getChildPosition(child)==4){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), CargaPedidos.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }
                    else if(recyclerView.getChildPosition(child)==5){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), CargaReservas.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }
                    else if(recyclerView.getChildPosition(child)==6){
                        Drawer.closeDrawers();
                        Intent mainIntent = new Intent(recyclerView.getContext(), CargaContacto.class);
                        context.startActivity(mainIntent);
                        actualActivity.finish();
                    }*//*


                    // Close the activity so the user won't able to go back this
                    // activity pressing Back button

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
                // code here will execute once the drawer is opened( As I dont want anything happened whe drawer is
                // open I am not going to put anything here)
            }

            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
                // Code here will execute once drawer is closed
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

    public void inicializarToolbar(int xml){
        //inicializarToolbar(xml,"FarmaSearch");
    }*/
}
