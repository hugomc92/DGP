package es.ugr.redforest.museumsforeveryone;

import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;

import java.util.List;

/**
 * Created by UserMan on 22/10/2016.
 */

public class LangAdapter  extends RecyclerView.Adapter<LangAdapter.LangViewHolder> {

	private List langList;

	public static class LangViewHolder extends RecyclerView.ViewHolder {
		private Button langBtn;

		public  LangViewHolder(View view) {
			super(view);

		}
	}
}
