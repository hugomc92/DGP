package es.ugr.redforest.museumsforeveryone.adapters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.models.ArtWork;
import es.ugr.redforest.museumsforeveryone.R;

/**
 * Adapter used in RecyclerView to display a list of Languages
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 * @see ArtWork
 * @see RecyclerView
 */

public class AdapterArtWork extends RecyclerView.Adapter<AdapterArtWork.ArtWorkViewHolder>
                            implements View.OnClickListener{

    private ArrayList<ArtWork> artWorkList;   // ArrayList containing the Languages to show
    private View.OnClickListener listener;  // Listener needed to handle onClick event

    /**
     * ViewHolder needed to handle how to show elements
     *
     * @author Miguel Angel Torres Lopez
     * @version 1.0.0
     * @see "layout/lang_list_row.xml"
     */
    public static class ArtWorkViewHolder extends RecyclerView.ViewHolder {
        private TextView artWorkTxt;

        /**
         * Constructor method. Gets references to visible elements
         *
         * @param view Needed by the superclass constructor
         */
        public  ArtWorkViewHolder(View view) {
            super(view);

            artWorkTxt = (TextView) view.findViewById(R.id.lang_txt);
        }
    }

    /**
     * Constructor method.
     *
     * @param artWorkList List of languages to show
     */
    public AdapterArtWork(ArrayList<ArtWork> artWorkList) {
        this.artWorkList = artWorkList;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ArtWorkViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.artwork_list_row, parent, false);

        itemView.setOnClickListener(this);
        return new ArtWorkViewHolder(itemView);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onBindViewHolder(ArtWorkViewHolder holder, int position) {
        ArtWork artWork = artWorkList.get(position);

        holder.artWorkTxt.setText(artWork.getArtWork());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getItemCount() {
        return artWorkList.size();
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
