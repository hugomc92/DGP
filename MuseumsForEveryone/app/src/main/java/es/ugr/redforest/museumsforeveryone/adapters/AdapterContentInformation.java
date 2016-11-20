package es.ugr.redforest.museumsforeveryone.adapters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;

/**
 * Adapter used in RecyclerView to display a list of Content information
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 * @see ContentInformation
 * @see RecyclerView
 */

public class AdapterContentInformation extends RecyclerView.Adapter<AdapterContentInformation.ContentInformationViewHolder>
        implements View.OnClickListener{
    private ArrayList<ContentInformation> contentInformationList;   // ArrayList containing the Content Types to show
    private View.OnClickListener listener;  // Listener needed to handle onClick event

    /**
     * ViewHolder needed to handle how to show elements
     *
     * @author Miguel Angel Torres Lopez
     * @version 1.0.0
     * @see "layout/content_information_list_row.xml"
     */
    public static class ContentInformationViewHolder extends RecyclerView.ViewHolder {
        private TextView contentInformationTxt;

        /**
         * Constructor method. Gets references to visible elements
         *
         * @param view Needed by the superclass constructor
         */
        public  ContentInformationViewHolder(View view) {
            super(view);

            contentInformationTxt = (TextView) view.findViewById(R.id.content_information_txt);
        }
    }

    /**
     * Constructor method.
     *
     * @param contentInformationList List of languages to show
     */
    public AdapterContentInformation(ArrayList<ContentInformation> contentInformationList) {
        this.contentInformationList = contentInformationList;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ContentInformationViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.content_information_list_row, parent, false);

        itemView.setOnClickListener(this);
        return new ContentInformationViewHolder(itemView);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onBindViewHolder(ContentInformationViewHolder holder, int position) {
        ContentInformation contentType = contentInformationList.get(position);

        holder.contentInformationTxt.setText(contentType.getName());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getItemCount() {
        return contentInformationList.size();
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
