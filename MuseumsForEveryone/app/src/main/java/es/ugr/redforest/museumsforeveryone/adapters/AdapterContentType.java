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

import es.ugr.redforest.museumsforeveryone.models.ContentType;
import es.ugr.redforest.museumsforeveryone.R;
import es.ugr.redforest.museumsforeveryone.utils.QueryBBDD;

/**
 * Adapter used in RecyclerView to display a list of Content Types
 *
 * @author Miguel Ángel Torres López
 * @version 1.0.0
 * @see ContentType
 * @see RecyclerView
 */

public class AdapterContentType extends RecyclerView.Adapter<AdapterContentType.ContentTypeViewHolder>
                            implements View.OnClickListener{

    private ArrayList<ContentType> contentTypeList;   // ArrayList containing the Content Types to show
    private View.OnClickListener listener;  // Listener needed to handle onClick event
    private Context context;

    /**
     * ViewHolder needed to handle how to show elements
     *
     * @author Miguel Angel Torres Lopez
     * @version 1.0.0
     * @see "layout/lang_list_row.xml"
     */
    public static class ContentTypeViewHolder extends RecyclerView.ViewHolder {
        private TextView contentTypeTxt;
        private ImageView contentTypeImg;

        /**
         * Constructor method. Gets references to visible elements
         *
         * @param view Needed by the superclass constructor
         */
        public  ContentTypeViewHolder(View view) {
            super(view);

            contentTypeTxt = (TextView) view.findViewById(R.id.content_type_txt);
            contentTypeImg = (ImageView) view.findViewById(R.id.content_type_img);
        }
    }

    /**
     * Constructor method.
     *
     * @param contentTypeList List of languages to show
     */
    public AdapterContentType(ArrayList<ContentType> contentTypeList,Context context) {
        this.contentTypeList = contentTypeList;
        this.context=context;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ContentTypeViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.content_type_list_row, parent, false);

        itemView.setOnClickListener(this);
        return new ContentTypeViewHolder(itemView);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onBindViewHolder(ContentTypeViewHolder holder, int position) {
        ContentType contentType = contentTypeList.get(position);

        holder.contentTypeTxt.setText(contentType.getName());
        Picasso.with(context).load(QueryBBDD.server+contentType.getIcon()).into(holder.contentTypeImg);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getItemCount() {
        return contentTypeList.size();
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
