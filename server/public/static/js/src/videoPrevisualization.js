function videoPrevisualization(input, subs, output) {
	$(input).on('change', function() {
		// get file and pull attributes
		var input = $(this)[0];
		var file = input.files[0];

		// load file into preview pane
		/*var reader = new FileReader();
		
		reader.onload = function(e){
			$(output).children('source').attr('src', e.target.result);
			$(output).load();
		};
		
		reader.readAsDataURL(file);*/

		output.children('source').attr('src', URL.createObjectURL(file));
		
		output[0].load();
	});

	$(subs).on('change', function() {
		output.append('<track src="' + URL.createObjectURL($(this)[0].files[0]) + '" kind="subtitles" label="Subtitulos">');

		output[0].load();
	});
}