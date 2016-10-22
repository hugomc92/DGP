package es.ugr.redforest.museumsforeveryone;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link LangFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 */
public class LangFragment extends Fragment {

    private ArrayList<Language> langList;
	private OnFragmentInteractionListener mListener;

    public LangFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_lang, container, false);
    }
/*
    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }
*/
    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */

    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }

	@Override
	public void onActivityCreated(Bundle state){
		super.onActivityCreated(state);

		langList = new ArrayList<>();
		RecyclerView recyclerLang = (RecyclerView) getView().findViewById(R.id.recycler_lang);
		LangAdapter langAdapter = new LangAdapter(langList);
		LinearLayoutManager layMan = new LinearLayoutManager(this.getContext(),
															 LinearLayoutManager.VERTICAL, false);

		recyclerLang = (RecyclerView) getView().findViewById(R.id.recycler_lang);
		recyclerLang.setLayoutManager(layMan);
		recyclerLang.setItemAnimator(new DefaultItemAnimator());
		recyclerLang.setAdapter(langAdapter);

		cargarIdiomas();    //SOLO PARA EL PROTOTIPO

	}

	private void cargarIdiomas() {
		Language es = new Language("Español", R.drawable.spain);
		langList.add(es);

		Language en = new Language("English", R.drawable.english);
		langList.add(en);

		Language fr = new Language("Français", R.drawable.french);
		langList.add(fr);

		Language de = new Language("Deutsch", R.drawable.german);
		langList.add(de);
	}
}
