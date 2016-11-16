package es.ugr.redforest.museumsforeveryone.adapters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.GuidedVisit;

/**
 * Adapter used in RecyclerView to display a list of GuidedVisits
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 * @see GuidedVisit
 * @see RecyclerView
 */

public class AdapterGuidedVisit extends RecyclerView.Adapter<AdapterGuidedVisit.GuidedVisitViewHolder>
                            implements View.OnClickListener {

    private ArrayList<GuidedVisit> guidedVisitList;   // ArrayList containing the Guided Visits to show
    private View.OnClickListener listener;  // Listener needed to handle onClick event

    /**
     * ViewHolder needed to handle how to show elements
     *
     * @author Miguel Ángel Torres López
     * @version 1.0.0
     * @see "layout/guided_visit_list_row.xml"
     */
    public static class GuidedVisitViewHolder extends RecyclerView.ViewHolder {
        private TextView guidedVisitTxt;

        /**
         * Constructor method. Gets references to visible elements
         *
         * @param view Needed by the superclass constructor
         */
        public  GuidedVisitViewHolder(View view) {
            super(view);

            guidedVisitTxt = (TextView) view.findViewById(R.id.guided_visit_txt);
        }
    }

    /**
     * Constructor method.
     *
     * @param guidedVisitList List of guided visits to show
     */
    public AdapterGuidedVisit(ArrayList<GuidedVisit> guidedVisitList) {
        this.guidedVisitList = guidedVisitList;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AdapterGuidedVisit.GuidedVisitViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.guided_visit_list_row, parent, false);

        itemView.setOnClickListener(this);
        return new AdapterGuidedVisit.GuidedVisitViewHolder(itemView);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onBindViewHolder(AdapterGuidedVisit.GuidedVisitViewHolder holder, int position) {
        GuidedVisit guidedVisit = guidedVisitList.get(position);

        holder.guidedVisitTxt.setText(guidedVisit.getGuidedVisit());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getItemCount() {
        return guidedVisitList.size();
    }

    public void setOnClickListener(View.OnClickListener listener) {
        this.listener = listener;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onClick(View view) {
        if(listener != null)
            listener.onClick(view);
    }

}
