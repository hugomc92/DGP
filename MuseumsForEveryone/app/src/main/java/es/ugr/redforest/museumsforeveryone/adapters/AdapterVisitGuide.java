package es.ugr.redforest.museumsforeveryone.adapters;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.GuidedVisit;
import es.ugr.redforest.museumsforeveryone.models.Location;

/**
 * Adapter used in RecyclerView to display a list of locations of a Guide Visit
 *
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 * @see GuidedVisit
 * @see RecyclerView
 */

public class AdapterVisitGuide extends RecyclerView.Adapter<AdapterVisitGuide.GuidedVisitViewHolder> {

    private ArrayList<Location> locations;   // ArrayList containing the locations  to show
    private Context context;

    /**
     * ViewHolder needed to handle how to show elements
     *
     * @author Emilio Chica Jiménez
     * @version 1.0.0
     * @see "layout/visit_guide_list_row.xml"
     */
    public static class GuidedVisitViewHolder extends RecyclerView.ViewHolder {
        private TextView guidedVisitTxt;
        private TextView order;
        /**
         * Constructor method. Gets references to visible elements
         *
         * @param view Needed by the superclass constructor
         */
        public GuidedVisitViewHolder(View view) {
            super(view);

            guidedVisitTxt = (TextView) view.findViewById(R.id.visit_guide_txt);
            order = (TextView) view.findViewById(R.id.visit_guide_order);
        }
    }

    /**
     * Constructor method.
     *
     * @param locations List of locations to show
     */
    public AdapterVisitGuide(ArrayList<Location> locations, Context context) {
        this.locations = locations;
        this.context=context;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AdapterVisitGuide.GuidedVisitViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.visit_guide_list_row, parent, false);

        return new AdapterVisitGuide.GuidedVisitViewHolder(itemView);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onBindViewHolder(AdapterVisitGuide.GuidedVisitViewHolder holder, int position) {
        Location location = locations.get(position);
        holder.guidedVisitTxt.setText(location.getDescription());
        holder.order.setText(String.valueOf(location.getOrder()));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getItemCount() {
        return locations.size();
    }

    /**
     * {@inheritDoc}
     */

}
