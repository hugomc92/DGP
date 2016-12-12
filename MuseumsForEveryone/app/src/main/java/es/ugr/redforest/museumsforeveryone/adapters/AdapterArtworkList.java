package es.ugr.redforest.museumsforeveryone.adapters;

import android.net.Uri;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.models.ContentInformation;
import es.ugr.redforest.museumsforeveryone.models.Multimedia;

/**
 * Adapter used in RecyclerView to display a list of Content information
 *
 * @author Miguel Ángel Torres López
 * @author Emilio Chica Jiménez
 * @version 1.0.0
 * @see ContentInformation
 * @see RecyclerView
 */

public class AdapterArtworkList extends RecyclerView.Adapter<AdapterArtworkList.ContentInformationViewHolder> {
    private ArrayList<ContentInformation> contentInformationList;   // ArrayList containing the Content Types to show
    private ArrayList<Multimedia> images; //ArrayList imgaes to show

    /**
     * ViewHolder needed to handle how to show elements
     *
     * @author Miguel Angel Torres Lopez
     * @version 1.0.0
     * @see "layout/content_information_list_row.xml"
     */
    public static class ContentInformationViewHolder extends RecyclerView.ViewHolder {
        private TextView contentInformationTxt;
        private ImageView contentInformationImage;

        /**
         * Constructor method. Gets references to visible elements
         *
         * @param view Needed by the superclass constructor
         */
        public  ContentInformationViewHolder(View view) {
            super(view);
            contentInformationImage = (ImageView) view.findViewById(R.id.rowIcon);
            contentInformationTxt = (TextView) view.findViewById(R.id.content_information_txt);
        }
    }

    /**
     * Constructor method.
     *
     * @param contentInformationList List of languages to show
     */
    public AdapterArtworkList(ArrayList<ContentInformation> contentInformationList, ArrayList<Multimedia> images) {
        this.contentInformationList = contentInformationList;
        this.images = images;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ContentInformationViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.content_information_list_row, parent, false);
        return new ContentInformationViewHolder(itemView);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onBindViewHolder(ContentInformationViewHolder holder, int position) {
        ContentInformation contentType = contentInformationList.get(position);

        holder.contentInformationTxt.setText(contentType.getName());
        holder.contentInformationImage.setImageURI(Uri.parse(images.get(position).getUrl()));
        holder.contentInformationImage.setContentDescription(images.get(position).getAlternativeText());

    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getItemCount() {
        return contentInformationList.size();
    }


}
