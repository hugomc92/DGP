function imagePrevisualization(input, output) {
	$(input).on('change', function() {
		// get file and pull attributes
		var input = $(this)[0];
		var file = input.files[0];

		// load file into preview pane
		var reader = new FileReader();
		
		reader.onload = function(e){
			$(output).attr('src', e.target.result);
		};
		
		reader.readAsDataURL(file);
	});
}