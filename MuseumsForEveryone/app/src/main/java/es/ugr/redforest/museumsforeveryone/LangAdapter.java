package es.ugr.redforest.museumsforeveryone;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

/**
 * Created by UserMan on 22/10/2016.
 */

public class LangAdapter  extends RecyclerView.Adapter<LangAdapter.LangViewHolder> {

	private ArrayList<Language> langList;

	public static class LangViewHolder extends RecyclerView.ViewHolder {
		private ImageView langImg;
		private TextView langTxt;

		public  LangViewHolder(View view) {
			super(view);

			langImg = (ImageView) view.findViewById(R.id.lang_img);
			langTxt = (TextView) view.findViewById(R.id.lang_txt);
		}
	}

	public LangAdapter (ArrayList<Language> langList) {
		this.langList = langList;
	}

	@Override
	public LangViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
		View itemView = LayoutInflater.from(parent.getContext())
						.inflate(R.layout.lang_list_row, parent, false);

		return new LangViewHolder(itemView);
	}

	@Override
	public void onBindViewHolder(LangViewHolder holder, int position) {
		Language lang = langList.get(position);

		holder.langImg.setImageResource(lang.getImage());
		holder.langTxt.setText(lang.getLang());
	}

	@Override
	public int getItemCount() {
		return langList.size();
	}
}
