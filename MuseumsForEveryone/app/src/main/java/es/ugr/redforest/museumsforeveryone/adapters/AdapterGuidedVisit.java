package es.ugr.redforest.museumsforeveryone.adapters;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.GuidedVisit;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;

/**
 * Adapter used in RecyclerView to display a list of GuidedVisits
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 * @see GuidedVisit
 * @see RecyclerView
 */

public class AdapterGuidedVisit extends RecyclerView.Adapter<AdapterGuidedVisit.GuidedVisitViewHolder> {

    private ArrayList<GuidedVisit> guidedVisitList;   // ArrayList containing the Guided Visits to show
    private Context context;

    /**
     * ViewHolder needed to handle how to show elements
     *
     * @author Miguel Ángel Torres López
     * @author Emilio Chica Jiménez
     * @version 1.0.0
     * @see "layout/guided_visit_list_row.xml"
     */
    public static class GuidedVisitViewHolder extends RecyclerView.ViewHolder {
        private TextView guidedVisitTxt;
        private ImageView guidedVisitImg;
        /**
         * Constructor method. Gets references to visible elements
         *
         * @param view Needed by the superclass constructor
         */
        public GuidedVisitViewHolder(View view) {
            super(view);

            guidedVisitTxt = (TextView) view.findViewById(R.id.guided_visit_txt);
            guidedVisitImg = (ImageView) view.findViewById(R.id.guided_visit_img);
        }
    }

    /**
     * Constructor method.
     *
     * @param guidedVisitList List of guided visits to show
     */
    public AdapterGuidedVisit(ArrayList<GuidedVisit> guidedVisitList,Context context) {
        this.guidedVisitList = guidedVisitList;
        this.context=context;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AdapterGuidedVisit.GuidedVisitViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.guided_visit_list_row, parent, false);

        return new AdapterGuidedVisit.GuidedVisitViewHolder(itemView);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onBindViewHolder(AdapterGuidedVisit.GuidedVisitViewHolder holder, int position) {
        GuidedVisit guidedVisit = guidedVisitList.get(position);

        holder.guidedVisitTxt.setText(guidedVisit.getName());
        Picasso.with(context).load(QueryBBDD.server+guidedVisit.getPhoto()).into(holder.guidedVisitImg);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getItemCount() {
        return guidedVisitList.size();
    }

    /**
     * {@inheritDoc}
     */

}
